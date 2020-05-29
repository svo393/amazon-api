import { Request, Response } from 'express'
import { AnswerComment, AnswerCommentCreateInput, AnswerCommentUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addAnswerComment = async (answerCommentInput: AnswerCommentCreateInput, res: Response): Promise<AnswerComment> => {
  const now = new Date()

  const [ addedAnswerComment ]: AnswerComment[] = await db('answerComments')
    .insert({
      ...answerCommentInput,
      userID: res.locals.userID,
      answerCommentCreatedAt: now,
      answerCommentUpdatedAt: now
    }, [ '*' ])

  return addedAnswerComment
}

const getCommentsByAnswer = async (req: Request): Promise<AnswerComment[]> => {
  return await db('answers')
    .where('answerID', req.params.answerID)
}

const getAnswerCommentByID = async (req: Request): Promise<AnswerComment> => {
  const answerComment = await db<AnswerComment>('answerComments')
    .first()
    .where('answerCommentID', req.params.answerCommentID)

  if (!answerComment) throw new StatusError(404, 'Not Found')
  return answerComment
}

const updateAnswerComment = async (answerCommentInput: AnswerCommentUpdateInput, req: Request): Promise<AnswerComment> => {
  const [ updatedRC ]: AnswerComment[] = await db<AnswerComment>('answerComments')
    .update({ ...answerCommentInput }, [ '*' ])
    .where('answerCommentID', req.params.answerCommentID)

  if (!updatedRC) throw new StatusError(404, 'Not Found')
  return updatedRC
}

const deleteAnswerComment = async (req: Request): Promise<void> => {
  const deleteCount = await db<AnswerComment>('answerComments')
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