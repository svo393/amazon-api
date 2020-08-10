import { Request } from 'express'
import R from 'ramda'
import { Answer, AnswerComment, AnswerCommentWithUser, AnswerWithUser, BatchWithCursor, Image, Question, QuestionCreateInput, QuestionCursorInput, QuestionUpdateInput, QuestionWithUser, Vote } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import getCursor from '../utils/getCursor'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addQuestion = async (questionInput: QuestionCreateInput, req: Request): Promise<Question> => {
  const now = new Date()

  const { rows: [ addedQuestion ] }: { rows: Question[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('questions').insert({
      ...questionInput,
      userID: req.session?.userID,
      createdAt: now,
      updatedAt: now,
      groupID: req.params.groupID
    }) ]
  )

  if (addedQuestion === undefined) {
    throw new StatusError(409, 'You\'ve already left a review for this product')
  }
  return addedQuestion
}

const getQuestionsByUser = async (req: Request): Promise<Question[]> => {
  return await db('questions')
    .where('userID', req.params.userID)
}

type QuestionWithDescendants =
BatchWithCursor<Question & {
  answers?: BatchWithCursor<AnswerWithUser & {
    answerComments?: BatchWithCursor<AnswerCommentWithUser>;
  }>;
}> & { groupID: number }

const getQuestionsByGroup = async (questionsInput: QuestionCursorInput, req: Request): Promise<QuestionWithDescendants> => {
  const {
    startCursor,
    limit,
    answerLimit = 1,
    answerCommentLimit = 0,
    page,
    onlyAnswered = true,
    sortBy = 'votes_desc'
  } = questionsInput
  const { groupID } = req.params

  let questions: (Question & { answerCount?: string })[] = await db('questions as q')
    .select(
      'q.questionID',
      'q.createdAt',
      'q.updatedAt',
      'q.content',
      'q.moderationStatus',
      'q.userID',
      'q.groupID'
    )
    .count('a.questionID as answerCount')
    .where('groupID', groupID)
    .andWhere('q.moderationStatus', 'APPROVED')
    .join('answers as a', 'q.questionID', 'a.questionID')
    .groupBy('q.questionID')

  const votes = await db<Vote>('votes')
    .whereNotNull('questionID')
    .orWhereNotNull('answerID')

  questions = questions
    .filter((q) => onlyAnswered ? Number(q.answerCount) !== 0 : true)
    .map((q) => {
      const voteSum = votes
        .filter((v) => v.questionID === q.questionID)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)
      delete q.answerCount
      return { ...q, votes: voteSum }
    })

  questions = sortItems(questions, sortBy)
  const perPageLimit = 1

  let questionsWithCursor

  if (page !== undefined) {
    const end = (page - 1) * perPageLimit + perPageLimit
    const totalCount = questions.length

    questionsWithCursor = {
      batch: questions.slice((page - 1) * perPageLimit, end),
      totalCount,
      hasNextPage: end < totalCount,
      groupID: Number(groupID)
    }
  } else {
    questionsWithCursor = {
      ...getCursor({
        startCursor,
        limit,
        idProp: 'questionID',
        data: questions
      }),
      groupID: Number(groupID)
    }
  }

  const questionIDs = Object.values(questionsWithCursor.batch)
    .map((q: Question) => q.questionID)

  let answers: (Answer & { avatar?: boolean; userName?: string })[] = await db('answers as a')
    .select(
      'a.answerID',
      'a.createdAt',
      'a.updatedAt',
      'a.content',
      'a.moderationStatus',
      'a.userID',
      'a.questionID',
      'u.avatar',
      'u.name as userName'
    )
    .join('users as u', 'a.userID', 'u.userID')
    .whereIn('questionID', questionIDs)
    .andWhere('a.moderationStatus', 'APPROVED')

  answers = answers
    .map((a) => {
      const voteSum = votes
        .filter((v) => v.answerID === a.answerID)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)
      return {
        ...R.omit([ 'userName', 'avatar' ], a),
        votes: voteSum,
        author: { avatar: a.avatar, name: a.userName, userID: a.userID }
      }
    })

  if (answers.length !== 0) {
    questionsWithCursor = {
      ...questionsWithCursor,
      batch: (questionsWithCursor.batch as any).map((q: Question) => {
        const curAnswers = answers.filter((a) => a.questionID === q.questionID)

        return curAnswers.length !== 0
          ? {
            ...q,
            answers: getCursor({
              startCursor: undefined,
              limit: answerLimit,
              idProp: 'answerID',
              data: sortItems(curAnswers, 'votes_desc')
            })
          }
          : q
      })
    }

    if (answerCommentLimit !== 0) {
      const answerIDs = R.flatten(Object.values(questionsWithCursor.batch)
        .map((q: any) =>
          q.answers.batch.map((a: any) => a.answerID)))

      let answerComments = await db<AnswerComment>('answerComments as ac')
        .select(
          'ac.answerCommentID',
          'ac.createdAt',
          'ac.updatedAt',
          'ac.content',
          'ac.moderationStatus',
          'ac.userID',
          'ac.answerID',
          'ac.parentAnswerCommentID',
          'u.avatar',
          'u.name as userName'
        )
        .join('users as u', 'ac.userID', 'u.userID')
        .whereIn('answerID', answerIDs)
        .andWhere('ac.moderationStatus', 'APPROVED')

      answerComments = answerComments
        .map((ac) => ({
          ...R.omit([ 'userName', 'avatar' ], ac),
          author: { avatar: ac.avatar, name: ac.userName, userID: ac.userID }
        }))

      if (answerComments.length !== 0) {
        questionsWithCursor = {
          ...questionsWithCursor,
          batch: questionsWithCursor.batch.map((q: Question & { answers: BatchWithCursor<Answer & { userName: string }> }) => ({
            ...q,
            answers: {
              batch: q.answers.batch.map((a: Answer & { userName: string }) => {
                const curAnswerComments = answerComments.filter((ac) => ac.answerID === a.answerID)
                return curAnswerComments.length !== 0
                  ? {
                    ...a,
                    answerComments: getCursor({
                      startCursor: undefined,
                      limit: answerCommentLimit,
                      idProp: 'answerCommentID',
                      data: sortItems(curAnswerComments, 'createdAt')
                    })
                  }
                  : a
              })
            }
          }))
        }
      }
    }
  }

  return questionsWithCursor
}

const getQuestionByID = async (req: Request): Promise<QuestionWithUser> => {
  const { questionID } = req.params

  const question = await db<Question & { userEmail: string }>('questions as q')
    .first(
      'q.questionID',
      'q.createdAt',
      'q.updatedAt',
      'q.content',
      'q.moderationStatus',
      'q.userID',
      'q.groupID',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .where('questionID', questionID)
    .join('users as u', 'q.userID', 'u.userID')

  if (question === undefined) throw new StatusError(404, 'Not Found')

  const images = await db<Image>('images')
    .where('questionID', questionID)

  const votes = await db<Vote>('votes')
    .where('questionID', questionID)

  const voteSum = votes.reduce((acc, cur) => (
    acc += cur.vote ? 1 : -1
  ), 0)

  const _question: QuestionWithUser = {
    ...(R.omit([ 'userName', 'userEmail', 'avatar', 'userID' ], question) as Question),
    images,
    votes: voteSum,
    author: {
      avatar: question.avatar,
      name: question.userName,
      email: question.userEmail,
      userID: question.userID
    }
  }

  ![ 'ROOT', 'ADMIN' ].includes(req.session?.role) &&
    delete _question.author.email

  return _question
}

const updateQuestion = async (questionInput: QuestionUpdateInput, req: Request): Promise<Question> => {
  const [ updatedQuestion ]: Question[] = await db('questions')
    .update({
      ...questionInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('questionID', req.params.questionID)

  if (updatedQuestion === undefined) throw new StatusError(404, 'Not Found')
  return updatedQuestion
}

const deleteQuestion = async (req: Request): Promise<void> => {
  const deleteCount = await db('questions')
    .del()
    .where('questionID', req.params.questionID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const uploadQuestionImages = async (files: Express.Multer.File[], req: Request): Promise<void> => {
  const filesWithIndexes = files.map((f) => {
    const index = getUploadIndex(f.filename)
    return {
      questionID: req.params.questionID,
      userID: req.session?.userID,
      index
    }
  })

  const uploadedImages: Image[] = await db('images')
    .insert(filesWithIndexes, [ '*' ])

  const uploadConfig = {
    fileNames: uploadedImages.map((i) => i.imageID),
    imagesPath: `${imagesBasePath}/images`,
    maxWidth: 1632,
    maxHeight: 1632,
    previewWidth: 175,
    previewHeight: 175,
    thumbWidth: 117,
    thumbHeight: 117
  }
  uploadImages(files, uploadConfig)
}

export default {
  addQuestion,
  getQuestionsByUser,
  getQuestionsByGroup,
  getQuestionByID,
  updateQuestion,
  deleteQuestion,
  uploadQuestionImages
}
