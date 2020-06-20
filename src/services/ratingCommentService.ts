import { Request, Response } from 'express'
import { RatingComment, RatingCommentCreateInput, RatingCommentUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const addRatingComment = async (ratingCommentInput: RatingCommentCreateInput, res: Response): Promise<RatingComment> => {
  const now = new Date()

  const [ addedRatingComment ]: RatingComment[] = await db('ratingComments')
    .insert({
      ...ratingCommentInput,
      userID: res.locals.userID,
      createdAt: now,
      updatedAt: now,
      moderationStatus: 'NEW'
    }, [ '*' ])

  return addedRatingComment
}

const getCommentsByRating = async (req: Request): Promise<RatingComment[]> => {
  return await db('ratings')
    .where('ratingID', req.params.ratingID)
}

const getRatingCommentByID = async (req: Request): Promise<RatingComment> => {
  const ratingComment = await db<RatingComment>('ratingComments')
    .first()
    .where('ratingCommentID', req.params.ratingCommentID)

  if (ratingComment === undefined) throw new StatusError(404, 'Not Found')
  return ratingComment
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

const uploadRatingCommentImages = (files: Express.Multer.File[], req: Request): void => {
  const uploadConfig = {
    imagesPath: `${imagesBasePath}/images`,
    maxWidth: 1632,
    maxHeight: 1632,
    previewWidth: 175,
    previewHeight: 175,
    thumbWidth: 117,
    thumbHeight: 117
  }
  uploadImages(files, req, uploadConfig)
}

export default {
  addRatingComment,
  getCommentsByRating,
  getRatingCommentByID,
  updateRatingComment,
  deleteRatingComment,
  uploadRatingCommentImages
}
