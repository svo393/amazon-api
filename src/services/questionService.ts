import { Request } from 'express'
import Knex from 'knex'
import { omit } from 'ramda'
import {
  AnswerWithUser,
  BatchWithCursor,
  Question,
  QuestionCreateInput,
  QuestionCursorInput,
  QuestionUpdateInput,
  QuestionWithUser,
  User,
  Vote
} from '../types'
import { defaultLimit } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import getCursor from '../utils/getCursor'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addQuestion = async (
  questionInput: QuestionCreateInput,
  req: Request
): Promise<QuestionWithUser & { upVotes: number }> => {
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const [addedQuestion]: Question[] = await trx('questions').insert(
      {
        ...questionInput,
        userID: req.session?.userID,
        createdAt: now,
        updatedAt: now,
        groupID: req.params.groupID
      },
      ['*']
    )

    const user = await trx<User>('users')
      .first()
      .where('userID', addedQuestion.userID)

    if (user === undefined) throw new StatusError()

    return {
      ...addedQuestion,
      votes: 0,
      upVotes: 0,
      author: {
        avatar: user.avatar,
        name: user.name,
        userID: user.userID
      }
    }
  })
}

const getQuestionsByUser = async (
  req: Request
): Promise<Question[]> => {
  return await db('questions').where('userID', req.params.userID)
}

type QuestionWithDescendants = BatchWithCursor<
  Question & {
    votes: number
    upVotes: number
    voted?: true
    answers?: BatchWithCursor<AnswerWithUser>
  }
> & { groupID: number }

const getQuestionsByGroup = async (
  questionsInput: QuestionCursorInput,
  req: Request
): Promise<QuestionWithDescendants> => {
  const {
    startCursor,
    limit,
    answerLimit = 1,
    page,
    onlyAnswered = false,
    sortBy = 'votesDelta_desc'
  } = questionsInput

  const { groupID } = req.params

  let questions: (Question & { answerCount?: string })[] = await db(
    'questions as q'
  )
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
    .andWhere('a.moderationStatus', 'APPROVED')
    .leftJoin('answers as a', 'q.questionID', 'a.questionID')
    .groupBy('q.questionID')

  const votes = await db<Vote>('votes')
    .whereNotNull('questionID')
    .orWhereNotNull('answerID')

  questions = questions
    .filter((q) =>
      onlyAnswered ? Number(q.answerCount) !== 0 : true
    )
    .map((q) => {
      const voteSum = votes.filter(
        (v) => v.questionID === q.questionID
      ).length

      const upVoteSum = votes.filter(
        (v) => v.questionID === q.questionID && v.vote
      ).length

      const voted = votes.find(
        (v) =>
          v.questionID === q.questionID &&
          v.userID === req.session?.userID
      )

      delete q.answerCount
      return {
        ...q,
        votes: voteSum,
        upVotes: upVoteSum,
        votesDelta: upVoteSum - (voteSum - upVoteSum),
        voted: req.session?.userID ? Boolean(voted) : undefined
      }
    })

  questions = sortItems(questions, sortBy)

  let questionsWithCursor
  const _limit = limit ?? defaultLimit

  if (page !== undefined) {
    const end = (page - 1) * _limit + _limit
    const totalCount = questions.length

    questionsWithCursor = {
      batch: questions.slice((page - 1) * _limit, end),
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

  const questionIDs = Object.values(questionsWithCursor.batch).map(
    (q: Question) => q.questionID
  )

  let answers = await db('answers as a')
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

  answers = answers.map((a) => {
    const voteSum = votes.filter((v) => v.answerID === a.answerID)
      .length

    const upVoteSum = votes.filter(
      (v) => v.answerID === a.answerID && v.vote
    ).length

    return {
      ...omit(['userName', 'userEmail', 'avatar', 'userID'], a),
      votes: voteSum,
      votesDelta: upVoteSum - (voteSum - upVoteSum),
      author: { avatar: a.avatar, name: a.userName, userID: a.userID }
    }
  })

  if (answers.length !== 0) {
    questionsWithCursor = {
      ...questionsWithCursor,
      batch: (questionsWithCursor.batch as any).map((q: Question) => {
        const curAnswers = answers.filter(
          (a) => a.questionID === q.questionID
        )

        return curAnswers.length !== 0
          ? {
              ...omit(['votesDelta'], q),
              answers: getCursor({
                startCursor: undefined,
                limit: answerLimit,
                idProp: 'answerID',
                data: sortItems(curAnswers, 'votesDelta_desc').map(
                  (a) => omit(['votesDelta'], a)
                )
              })
            }
          : omit(['votesDelta'], q)
      })
    }
  }

  return questionsWithCursor
}

const getQuestionByID = async (
  req: Request
): Promise<QuestionWithUser> => {
  const { questionID } = req.params

  const question = await db<Question & { userEmail: string }>(
    'questions as q'
  )
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

  const votes = await db<Vote>('votes').where(
    'questionID',
    questionID
  )

  const voteSum = votes.reduce(
    (acc, cur) => (acc += cur.vote ? 1 : -1),
    0
  )

  const _question: QuestionWithUser = {
    ...(omit(
      ['userName', 'userEmail', 'avatar', 'userID'],
      question
    ) as Question),
    votes: voteSum,
    author: {
      avatar: question.avatar,
      name: question.userName,
      email: question.userEmail,
      userID: question.userID
    }
  }

  !['ROOT', 'ADMIN'].includes(req.session?.role) &&
    delete _question.author

  return _question
}

const updateQuestion = async (
  questionInput: QuestionUpdateInput,
  req: Request
): Promise<Question> => {
  const userIsAdmin = ['ROOT', 'ADMIN'].includes(req.session?.role)

  const [updatedQuestion]: Question[] = await db('questions')
    .update(
      {
        ...questionInput,
        moderationStatus: userIsAdmin
          ? questionInput.moderationStatus
          : 'NEW',
        updatedAt: new Date()
      },
      ['*']
    )
    .where('questionID', req.params.questionID)

  if (updatedQuestion === undefined)
    throw new StatusError(404, 'Not Found')
  return updatedQuestion
}

const deleteQuestion = async (req: Request): Promise<void> => {
  const deleteCount = await db('questions')
    .del()
    .where('questionID', req.params.questionID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addQuestion,
  getQuestionsByUser,
  getQuestionsByGroup,
  getQuestionByID,
  updateQuestion,
  deleteQuestion
}
