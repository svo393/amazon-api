import { Request, Response } from 'express'
import { Answer, AnswerCreateInput, AnswerUpdateInput } from '../types'
import { db } from '../utils/db'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const addAnswer = async (answerInput: AnswerCreateInput, res: Response): Promise<Answer> => {
  const now = new Date()

  const [ addedAnswer ]: Answer[] = await db('answers')
    .insert({
      ...answerInput,
      userID: res.locals.userID,
      answerCreatedAt: now,
      answerUpdatedAt: now
    }, [ '*' ])

  return addedAnswer
}

const getAnswersByQuestion = async (req: Request): Promise<Answer[]> => {
  return await db('questions')
    .where('questionID', req.params.questionID)
}

const getAnswerByID = async (req: Request): Promise<Answer> => {
  const answer = await db<Answer>('answers')
    .first()
    .where('answerID', req.params.answerID)

  if (!answer) throw new StatusError(404, 'Not Found')
  return answer
}

const updateAnswer = async (answerInput: AnswerUpdateInput, req: Request): Promise<Answer> => {
  const [ updatedRC ]: Answer[] = await db<Answer>('answers')
    .update({
      ...answerInput,
      answerUpdatedAt: new Date()
    }, [ '*' ])
    .where('answerID', req.params.answerID)

  if (!updatedRC) throw new StatusError(404, 'Not Found')
  return updatedRC
}

const deleteAnswer = async (req: Request): Promise<void> => {
  const deleteCount = await db<Answer>('answers')
    .del()
    .where('answerID', req.params.answerID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const uploadAnswerImages = (files: Express.Multer.File[], req: Request): void => {
  const uploadConfig = {
    imagePath: './public/media/answers',
    maxWidth: 1632,
    maxHeight: 1632,
    previewWidth: 175,
    previewHeight: 175,
    thumbWidth: 117,
    thumbHeight: 117
  }
  uploadImages(files, req, uploadConfig, 'answerID')
}

export default {
  addAnswer,
  getAnswersByQuestion,
  getAnswerByID,
  updateAnswer,
  deleteAnswer,
  uploadAnswerImages
}
