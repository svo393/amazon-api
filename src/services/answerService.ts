import { Request } from 'express'
import { omit } from 'ramda'
import { Answer, AnswerCreateInput, AnswerUpdateInput, AnswerWithUser, BatchWithCursor, CursorInput, Vote } from '../types'
import { db } from '../utils/db'
import getCursor from '../utils/getCursor'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addAnswer = async (answerInput: AnswerCreateInput, req: Request): Promise<Answer> => {
  const now = new Date()

  const [ addedAnswer ]: Answer[] = await db('answers')
    .insert({
      ...answerInput,
      userID: req.session?.userID,
      createdAt: now,
      updatedAt: now,
      questionID: req.params.questionID
    }, [ '*' ])

  return addedAnswer
}

const getAnswersByQuestion = async (cursorInput: CursorInput, req: Request): Promise<BatchWithCursor<Answer & { votes: number; upVotes: number }> & { questionID: number }> => {
  const { startCursor, limit = 2, page } = cursorInput
  const { questionID } = req.params

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
    .where('questionID', questionID)
    .andWhere('a.moderationStatus', 'APPROVED')

  const votes = await db<Vote>('votes')
    .whereNotNull('answerID')

  answers = answers
    .map((a) => {
      const voteSum = votes
        .filter((v) => v.answerID === a.answerID)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)

      const upVoteSum = votes
        .filter((v) => v.answerID === a.answerID && v.vote)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)
      return {
        ...omit([ 'userName', 'userEmail', 'avatar', 'userID' ], a),
        votes: voteSum,
        upVotes: upVoteSum,
        author: { avatar: a.avatar, name: a.userName, userID: a.userID }
      }
    })

  answers = sortItems(answers, 'votes_desc')
  const perPageLimit = 10

  if (page !== undefined) {
    const end = (page - 1) * perPageLimit + perPageLimit
    const totalCount = answers.length

    return {
      batch: answers.slice((page - 1) * perPageLimit, end),
      totalCount,
      hasNextPage: end < totalCount,
      questionID: Number(questionID)
    }
  }

  return {
    ...getCursor({
      startCursor,
      limit,
      idProp: 'answerID',
      data: answers
    }),
    questionID: Number(questionID)
  }
}

const getAnswerByID = async (req: Request): Promise<AnswerWithUser> => {
  const { answerID } = req.params

  const answer: Answer & { avatar: boolean; userName: string; userEmail: string } = await db('answers as a')
    .first(
      'a.answerID',
      'a.createdAt',
      'a.updatedAt',
      'a.content',
      'a.moderationStatus',
      'a.userID',
      'a.questionID',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .where('answerID', answerID)
    .join('users as u', 'a.userID', 'u.userID')

  if (answer === undefined) throw new StatusError(404, 'Not Found')

  const votes = await db<Vote>('votes')
    .where('answerID', answerID)

  const voteSum = votes.reduce((acc, cur) => (
    acc += cur.vote ? 1 : -1
  ), 0)

  const _answer: AnswerWithUser = {
    ...(omit([ 'userName', 'userEmail', 'avatar', 'userID' ], answer) as Answer),
    votes: voteSum,
    author: {
      avatar: answer.avatar,
      name: answer.userName,
      email: answer.userEmail,
      userID: answer.userID
    }
  }

  ![ 'ROOT', 'ADMIN' ].includes(req.session?.role) &&
    delete _answer.author.email

  return _answer
}

const updateAnswer = async (answerInput: AnswerUpdateInput, req: Request): Promise<Answer> => {
  const [ updatedAnswer ]: Answer[] = await db('answers')
    .update({
      ...answerInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('answerID', req.params.answerID)

  if (updatedAnswer === undefined) throw new StatusError(404, 'Not Found')
  return updatedAnswer
}

const deleteAnswer = async (req: Request): Promise<void> => {
  const deleteCount = await db('answers')
    .del()
    .where('answerID', req.params.answerID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addAnswer,
  getAnswersByQuestion,
  getAnswerByID,
  updateAnswer,
  deleteAnswer
}
