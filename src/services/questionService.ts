import { Request } from 'express'
import R from 'ramda'
import { Answer, BatchWithCursor, Image, Question, QuestionCreateInput, QuestionCursorInput, QuestionUpdateInput, Vote } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
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

const getQuestionsByGroup = async (questionsInput: QuestionCursorInput, req: Request): Promise<BatchWithCursor<Question & { answers: BatchWithCursor<Answer> }> & { groupID: number }> => {
  const {
    startCursor,
    limit,
    answerLimit = 1,
    page,
    sortBy = 'votes_desc',
    q
  } = questionsInput
  const { groupID } = req.params

  let questions = await db<Question>('questions')
    .where('groupID', groupID)

  const votes = await db<Vote>('votes')
    .whereNotNull('questionID')
    .orWhereNotNull('answerID')

  questions = questions
    .map((q) => {
      const voteSum = votes
        .filter((v) => v.questionID === q.questionID)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)
      return { ...q, votes: voteSum, type: 'question' }
    })

  if (q !== undefined) {
    questions = questions
      .filter((_, i) =>
        fuseIndexes(questions, [ 'content' ], q).includes(i))
  }

  questions = sortItems(questions, sortBy)

  let questionsWithCursor = {
    ...getCursor({
      startCursor,
      limit,
      idProp: 'questionID',
      data: questions
    }),
    groupID: Number(groupID)
  }

  const questionIDs = Object.values(questionsWithCursor.batch)
    .map((q: Question) => q.questionID)

  let answers = await db<Answer>('answers')
    .whereIn('questionID', questionIDs)

  answers = answers
    .map((q) => {
      const voteSum = votes
        .filter((v) => v.answerID === q.answerID)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)
      return { ...q, votes: voteSum, type: 'answer' }
    })

  questionsWithCursor = {
    ...questionsWithCursor,
    batch: questionsWithCursor.batch.map((q: Question) => {
      const curAnswers = answers.filter((a) => a.questionID === q.questionID)
      return {
        ...q,
        answers: getCursor({
          startCursor: undefined,
          limit: answerLimit,
          idProp: 'answersID',
          data: sortItems(curAnswers, 'votes_desc')
        })
      }
    })
  }

  return questionsWithCursor
}

const getQuestionByID = async (req: Request): Promise<Question &
{ images: Image[] }> => {
  const { questionID } = req.params

  const question = await db<Question>('questions as q')
    .first(
      'q.questionID',
      'q.createdAt',
      'q.updatedAt',
      'q.content',
      'q.moderationStatus',
      'q.userID',
      'q.groupID',
      'u.email as userEmail'
    )
    .where('questionID', questionID)
    .join('users as u', 'q.userID', 'u.userID')
    .groupBy('q.questionID', 'userEmail')

  if (question === undefined) throw new StatusError(404, 'Not Found')

  const images = await db<Image>('images')
    .where('questionID', questionID)

  const votes = await db<Vote>('votes')
    .where('questionID', questionID)

  const voteSum = votes.reduce((acc, cur) => (
    acc += cur.vote ? 1 : -1
  ), 0)

  const _question = {
    ...question,
    images,
    votes: voteSum,
    type: 'question'
  }

  return [ 'ROOT', 'ADMIN' ].includes(req.session?.role)
    ? _question
    : R.omit([ 'userEmail' ], _question)
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
