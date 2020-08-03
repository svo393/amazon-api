import { Request } from 'express'
import R from 'ramda'
import { AnswerComment, AnswerCommentCreateInput, AnswerCommentUpdateInput, Image } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const addAnswerComment = async (answerCommentInput: AnswerCommentCreateInput, req: Request): Promise<AnswerComment> => {
  const now = new Date()

  const [ addedAnswerComment ]: AnswerComment[] = await db('answerComments')
    .insert({
      ...answerCommentInput,
      userID: req.session?.userID,
      createdAt: now,
      updatedAt: now,
      moderationStatus: 'NEW',
      answerID: req.params.answerID
    }, [ '*' ])

  return addedAnswerComment
}

const getCommentsByAnswer = async (req: Request): Promise<AnswerComment[]> => {
  return await db('answers')
    .where('answerID', req.params.answerID)
}

const getAnswerCommentByID = async (req: Request): Promise<AnswerComment &
{ images: Image[] }> => {
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
      'u.email as userEmail'
    )
    .where('answerCommentID', answerCommentID)
    .join('users as u', 'ac.userID', 'u.userID')
    .groupBy('ac.answerCommentID', 'userEmail')

  if (answerComment === undefined) throw new StatusError(404, 'Not Found')

  const images = await db<Image>('images')
    .where('answerCommentID', answerCommentID)

  return [ 'ROOT', 'ADMIN' ].includes(req.session?.role)
    ? { ...answerComment, images, type: 'answerComment' }
    : { ...R.omit([ 'userEmail' ], answerComment), images, type: 'answerComment' }
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

const uploadAnswerCommentImages = async (files: Express.Multer.File[], req: Request): Promise<void> => {
  const filesWithIndexes = files.map((f) => {
    const index = getUploadIndex(f.filename)
    return {
      answerCommentID: req.params.answerCommentID,
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
  addAnswerComment,
  getCommentsByAnswer,
  getAnswerCommentByID,
  updateAnswerComment,
  deleteAnswerComment,
  uploadAnswerCommentImages
}
