import { Request } from 'express'
import R from 'ramda'
import { Image, Question, QuestionCreateInput, QuestionUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
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
      moderationStatus: 'NEW',
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

const getQuestionsByGroup = async (req: Request): Promise<Question[]> => {
  return await db('questions')
    .where('groupID', req.params.groupID)
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
      'q.likes',
      'q.dislikes',
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

  return [ 'ROOT', 'ADMIN' ].includes(req.session?.role)
    ? { ...question, images }
    : { ...R.omit([ 'userEmail' ], question), images }
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
