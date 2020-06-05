import { Request, Response } from 'express'
import { Question, QuestionCreateInput, QuestionUpdateInput } from '../types'
import { db } from '../utils/db'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const addQuestion = async (questionInput: QuestionCreateInput, res: Response): Promise<Question> => {
  const now = new Date()

  const { rows: [ addedQuestion ] }: { rows: Question[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('questions').insert({
      ...questionInput,
      userID: res.locals.userID,
      questionCreatedAt: now,
      questionUpdatedAt: now,
      moderationStatus: 'NEW'
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

const getQuestionsByGroup = async (req: Request): Promise<Question[]> => {
  return await db('questions')
    .where('groupID', req.params.groupID)
}

const getQuestionByID = async (req: Request): Promise<Question> => {
  const question = await db<Question>('questions')
    .first()
    .where('questionID', req.params.questionID)

  if (!question) throw new StatusError(404, 'Not Found')
  return question
}

const updateQuestion = async (questionInput: QuestionUpdateInput, req: Request): Promise<Question> => {
  const [ updatedQuestion ]: Question[] = await db('questions')
    .update({
      ...questionInput,
      questionUpdatedAt: new Date()
    }, [ '*' ])
    .where('questionID', req.params.questionID)

  if (!updatedQuestion) throw new StatusError(404, 'Not Found')
  return updatedQuestion
}

const deleteQuestion = async (req: Request): Promise<void> => {
  const deleteCount = await db('questions')
    .del()
    .where('questionID', req.params.questionID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const uploadQuestionImages = (files: Express.Multer.File[], req: Request): void => {
  const uploadConfig = {
    imagePath: './public/media/questions',
    maxWidth: 1632,
    maxHeight: 1632,
    previewWidth: 175,
    previewHeight: 175,
    thumbWidth: 117,
    thumbHeight: 117
  }
  uploadImages(files, req, uploadConfig, 'questionID')
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
