import { Request, Response } from 'express'
import { Rating, RatingCreateInput, RatingUpdateInput } from '../types'
import { db } from '../utils/db'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const addRating = async (ratingInput: RatingCreateInput, res: Response): Promise<Rating> => {
  const now = new Date()

  const { rows: [ addedRating ] }: { rows: Rating[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('ratings').insert({
      ...ratingInput,
      userID: res.locals.userID,
      createdAt: now,
      updatedAt: now,
      moderationStatus: 'NEW'
    }) ]
  )

  if (!addedRating) {
    throw new StatusError(409, 'You\'ve already left a review for this product')
  }
  return addedRating
}

const getRatingsByUser = async (req: Request): Promise<Rating[]> => {
  return await db('ratings')
    .where('userID', req.params.userID)
}

const getRatingsByGroup = async (req: Request): Promise<Rating[]> => {
  return await db('ratings')
    .where('groupID', req.params.groupID)
}

const getRatingByID = async (req: Request): Promise<Rating> => {
  const rating = await db<Rating>('ratings')
    .first()
    .where('ratingID', req.params.ratingID)

  if (!rating) throw new StatusError(404, 'Not Found')
  return rating
}

const updateRating = async (ratingInput: RatingUpdateInput, req: Request): Promise<Rating> => {
  const [ updatedRating ]: Rating[] = await db('ratings')
    .update({
      ...ratingInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('ratingID', req.params.ratingID)

  if (!updatedRating) throw new StatusError(404, 'Not Found')
  return updatedRating
}

const deleteRating = async (req: Request): Promise<void> => {
  const deleteCount = await db('ratings')
    .del()
    .where('ratingID', req.params.ratingID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const uploadRatingImages = (files: Express.Multer.File[], req: Request): void => {
  const uploadConfig = {
    imagePath: './public/media/ratings',
    maxWidth: 1632,
    maxHeight: 1632,
    previewWidth: 175,
    previewHeight: 175,
    thumbWidth: 117,
    thumbHeight: 117
  }
  uploadImages(files, req, uploadConfig, 'ratingID')
}

export default {
  addRating,
  getRatingsByUser,
  getRatingsByGroup,
  getRatingByID,
  updateRating,
  deleteRating,
  uploadRatingImages
}
