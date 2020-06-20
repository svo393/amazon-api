import { Request, Response } from 'express'
import { Answer, AnswerCreateInput, AnswerUpdateInput, Image } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const addAnswer = async (answerInput: AnswerCreateInput, res: Response): Promise<Answer> => {
  const now = new Date()

  const [ addedAnswer ]: Answer[] = await db('answers')
    .insert({
      ...answerInput,
      userID: res.locals.userID,
      createdAt: now,
      updatedAt: now,
      moderationStatus: 'NEW'
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

  if (answer === undefined) throw new StatusError(404, 'Not Found')
  return answer
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

const uploadAnswerImages = async (files: Express.Multer.File[], req: Request, res: Response): Promise<void> => {
  const filesWithIndexes = files.map((f) => {
    const index = getUploadIndex(f.filename)
    return {
      answerID: req.params.answerID,
      userID: res.locals.userID,
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
  addAnswer,
  getAnswersByQuestion,
  getAnswerByID,
  updateAnswer,
  deleteAnswer,
  uploadAnswerImages
}
