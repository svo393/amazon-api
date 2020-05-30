import { Request, Response } from 'express'
import { Question, QuestionCreateInput, QuestionUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addQuestion = async (questionInput: QuestionCreateInput, res: Response): Promise<Question> => {
  const userID = res.locals.userID
  const now = new Date()

  const { rows: [ addedQuestion ] }: { rows: Question[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('questions').insert({
      ...questionInput,
      userID,
      questionCreatedAt: now,
      questionUpdatedAt: now
    }) ]
  )

  if (!addedQuestion) {
    throw new StatusError(409, 'You\'ve already left a review for this product')
  }
  return addedQuestion
}

const getQuestionsByUser = async (req: Request): Promise<Question[]> => {
  return await db('questions')
    .where('userID', req.params.userID)
}

const getQuestionsByProduct = async (req: Request): Promise<Question[]> => {
  return await db('questions')
    .where('productID', req.params.productID)
}

const getQuestionByID = async (req: Request): Promise<Question> => {
  const question = await db<Question>('questions')
    .first()
    .where('questionID', req.params.questionID)

  if (!question) throw new StatusError(404, 'Not Found')
  return question
}

const updateQuestion = async (questionInput: QuestionUpdateInput, req: Request): Promise<Question> => {
  const [ updatedQuestion ]: Question[] = await db<Question>('questions')
    .update({ ...questionInput }, [ '*' ])
    .where('questionID', req.params.questionID)

  if (!updatedQuestion) throw new StatusError(404, 'Not Found')
  return updatedQuestion
}

const deleteQuestion = async (req: Request): Promise<void> => {
  const deleteCount = await db<Question>('questions')
    .del()
    .where('questionID', req.params.questionID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addQuestion,
  getQuestionsByUser,
  getQuestionsByProduct,
  getQuestionByID,
  updateQuestion,
  deleteQuestion
}
