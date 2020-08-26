import { Request } from 'express'
import { omit } from 'ramda'
import { AnswerComment, AnswerCommentCreateInput, AnswerCommentUpdateInput, AnswerCommentWithUser } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addAnswerComment = async (answerCommentInput: AnswerCommentCreateInput, req: Request): Promise<AnswerComment> => {
  const now = new Date()

  const [ addedAnswerComment ]: AnswerComment[] = await db('answerComments')
    .insert({
      ...answerCommentInput,
      userID: req.session?.userID,
      createdAt: now,
      updatedAt: now,
      answerID: req.params.answerID
    }, [ '*' ])

  return addedAnswerComment
}

const getCommentsByAnswer = async (req: Request): Promise<AnswerComment[]> => {
  return await db('answers')
    .where('answerID', req.params.answerID)
}

const getAnswerCommentByID = async (req: Request): Promise<AnswerCommentWithUser> => {
  const { answerCommentID } = req.params

  const answerComment = await db<AnswerComment>('answerComments as ac')
    .first(
      'ac.answerCommentID',
      'ac.createdAt',
      'ac.updatedAt',
      'ac.content',
      'ac.moderationStatus',
      'ac.userID',
      'ac.answerID',
      'ac.parentAnswerCommentID',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .where('answerCommentID', answerCommentID)
    .join('users as u', 'ac.userID', 'u.userID')

  if (answerComment === undefined) throw new StatusError(404, 'Not Found')

  const _answerComment: AnswerCommentWithUser = {
    ...(omit([ 'userName', 'userEmail', 'avatar', 'userID' ], answerComment) as AnswerComment),
    author: {
      avatar: answerComment.avatar,
      name: answerComment.userName,
      email: answerComment.userEmail,
      userID: answerComment.userID
    }
  }

  ![ 'ROOT', 'ADMIN' ].includes(req.session?.role) &&
  delete _answerComment.author.email

  return _answerComment
}

const updateAnswerComment = async (answerCommentInput: AnswerCommentUpdateInput, req: Request): Promise<AnswerComment> => {
  const [ updatedRC ]: AnswerComment[] = await db('answerComments')
    .update({
      ...answerCommentInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('answerCommentID', req.params.answerCommentID)

  if (updatedRC === undefined) throw new StatusError(404, 'Not Found')
  return updatedRC
}

const deleteAnswerComment = async (req: Request): Promise<void> => {
  const deleteCount = await db('answerComments')
    .del()
    .where('answerCommentID', req.params.answerCommentID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addAnswerComment,
  getCommentsByAnswer,
  getAnswerCommentByID,
  updateAnswerComment,
  deleteAnswerComment
}
