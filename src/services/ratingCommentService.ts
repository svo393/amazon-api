import { Request } from 'express'
import R from 'ramda'
import { Image, RatingComment, RatingCommentCreateInput, RatingCommentUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const addRatingComment = async (ratingCommentInput: RatingCommentCreateInput, req: Request): Promise<RatingComment> => {
  const now = new Date()

  const [ addedRatingComment ]: RatingComment[] = await db('ratingComments')
    .insert({
      ...ratingCommentInput,
      userID: req.session?.userID,
      createdAt: now,
      updatedAt: now,
      ratingID: req.params.ratingID
    }, [ '*' ])

  return addedRatingComment
}

const getCommentsByRating = async (req: Request): Promise<RatingComment[]> => {
  return await db('ratings')
    .where('ratingID', req.params.ratingID)
}

const getRatingCommentByID = async (req: Request): Promise<RatingComment &
{ images: Image[] }> => {
  const { ratingCommentID } = req.params

  const ratingComment = await db<RatingComment>('ratingComments as rc')
    .first(
      'rc.ratingCommentID',
      'rc.createdAt',
      'rc.updatedAt',
      'rc.content',
      'rc.moderationStatus',
      'rc.userID',
      'rc.ratingID',
      'rc.parentRatingCommentID',
      'u.email as userEmail'
    )
    .where('ratingCommentID', ratingCommentID)
    .join('users as u', 'rc.userID', 'u.userID')
    .groupBy('rc.ratingCommentID', 'userEmail')

  if (ratingComment === undefined) throw new StatusError(404, 'Not Found')

  const images = await db<Image>('images')
    .where('ratingCommentID', ratingCommentID)

  return [ 'ROOT', 'ADMIN' ].includes(req.session?.role)
    ? { ...ratingComment, images, type: 'ratingComment' }
    : { ...R.omit([ 'userEmail' ], ratingComment), images, type: 'ratingComment' }
}

const updateRatingComment = async (ratingCommentInput: RatingCommentUpdateInput, req: Request): Promise<RatingComment> => {
  const [ updatedRatingComment ]: RatingComment[] = await db('ratingComments')
    .update({
      ...ratingCommentInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('ratingCommentID', req.params.ratingCommentID)

  if (updatedRatingComment === undefined) throw new StatusError(404, 'Not Found')
  return updatedRatingComment
}

const deleteRatingComment = async (req: Request): Promise<void> => {
  const deleteCount = await db('ratingComments')
    .del()
    .where('ratingCommentID', req.params.ratingCommentID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const uploadRatingCommentImages = async (files: Express.Multer.File[], req: Request): Promise<void> => {
  const filesWithIndexes = files.map((f) => {
    const index = getUploadIndex(f.filename)
    return {
      ratingCommentID: req.params.ratingCommentID,
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
  addRatingComment,
  getCommentsByRating,
  getRatingCommentByID,
  updateRatingComment,
  deleteRatingComment,
  uploadRatingCommentImages
}
