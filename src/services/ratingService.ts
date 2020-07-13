import { Request } from 'express'
import R from 'ramda'
import { Image, Rating, RatingCreateInput, RatingsFiltersInput, RatingUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const addRating = async (ratingInput: RatingCreateInput, req: Request): Promise<Rating> => {
  const now = new Date()

  const { rows: [ addedRating ] }: { rows: Rating[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('ratings').insert({
      ...ratingInput,
      userID: req.session?.userID,
      createdAt: now,
      updatedAt: now,
      moderationStatus: 'NEW'
    }) ]
  )

  if (addedRating === undefined) {
    throw new StatusError(409, 'You\'ve already left a review for this product')
  }
  return addedRating
}

const getRatings = async (ratingsFiltersInput: RatingsFiltersInput, req: Request): Promise<Rating[]> => {
  const {
    q,
    groupID,
    userEmail,
    moderationStatuses,
    isVerified,
    createdFrom,
    createdTo,
    starsMin,
    starsMax,
    likesMin,
    likesMax,
    dislikesMin,
    dislikesMax
  } = ratingsFiltersInput

  const userHasPermission = [ 'ROOT', 'ADMIN' ].includes(req.session?.role)

  let ratings: Rating[] = await db('ratings as r')
    .select(
      'r.ratingID',
      'r.createdAt',
      'r.updatedAt',
      'r.title',
      'r.review',
      'r.stars',
      'r.likes',
      'r.dislikes',
      'r.isVerified',
      'r.moderationStatus',
      'r.userID',
      'r.groupID',
      'u.email as userEmail'
    )
    .join('users as u', 'r.userID', 'u.userID')
    .groupBy('r.ratingID', 'userEmail')

  if (q !== undefined) {
    ratings = ratings
      .filter((r) => r.title?.toLowerCase().includes(q.toLowerCase()) ||
      r.review.toLowerCase().includes(q.toLowerCase()))
  }

  if (groupID !== undefined) {
    ratings = ratings
      .filter((r) => r.groupID === groupID)
  }

  if (userHasPermission && userEmail !== undefined) {
    ratings = ratings
      .filter((r) => r.userEmail?.toLowerCase().includes(userEmail.toLowerCase()))
  }

  if (moderationStatuses !== undefined) {
    ratings = ratings
      .filter((r) => moderationStatuses.split(',').includes(r.moderationStatus))
  }

  if (isVerified !== undefined) {
    ratings = ratings
      .filter((r) => r.isVerified === isVerified)
  }

  if (createdFrom !== undefined) {
    ratings = ratings
      .filter((r) => r.createdAt >= new Date(createdFrom))
  }

  if (createdTo !== undefined) {
    ratings = ratings
      .filter((r) => r.createdAt <= new Date(createdTo))
  }

  if (starsMin !== undefined) {
    ratings = ratings
      .filter((r) => r.stars >= starsMin)
  }

  if (starsMax !== undefined) {
    ratings = ratings
      .filter((r) => r.stars <= starsMax)
  }

  if (likesMin !== undefined) {
    ratings = ratings
      .filter((r) => r.likes >= likesMin)
  }

  if (likesMax !== undefined) {
    ratings = ratings
      .filter((r) => r.likes <= likesMax)
  }

  if (dislikesMin !== undefined) {
    ratings = ratings
      .filter((r) => r.dislikes >= dislikesMin)
  }

  if (dislikesMax !== undefined) {
    ratings = ratings
      .filter((r) => r.dislikes <= dislikesMax)
  }

  return userHasPermission
    ? ratings
    : ratings.map((r) => ({ ...R.omit([ 'userEmail' ], r) }))
}

const getRatingByID = async (req: Request): Promise<Rating &
{ images: Image[] }> => {
  const { ratingID } = req.params

  const rating = await db<Rating>('ratings as r')
    .first(
      'r.ratingID',
      'r.createdAt',
      'r.updatedAt',
      'r.title',
      'r.review',
      'r.stars',
      'r.likes',
      'r.dislikes',
      'r.isVerified',
      'r.moderationStatus',
      'r.userID',
      'r.groupID',
      'u.email as userEmail'
    )
    .where('ratingID', ratingID)
    .join('users as u', 'r.userID', 'u.userID')
    .groupBy('r.ratingID', 'userEmail')

  if (rating === undefined) throw new StatusError(404, 'Not Found')

  const images = await db<Image>('images')
    .where('ratingID', ratingID)

  return [ 'ROOT', 'ADMIN' ].includes(req.session?.role)
    ? { ...rating, images }
    : { ...R.omit([ 'userEmail' ], rating), images }
}

const updateRating = async (ratingInput: RatingUpdateInput, req: Request): Promise<Rating> => {
  const [ updatedRating ]: Rating[] = await db('ratings')
    .update({
      ...ratingInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('ratingID', req.params.ratingID)

  if (updatedRating === undefined) throw new StatusError(404, 'Not Found')
  return updatedRating
}

const deleteRating = async (req: Request): Promise<void> => {
  const deleteCount = await db('ratings')
    .del()
    .where('ratingID', req.params.ratingID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const uploadRatingImages = async (files: Express.Multer.File[], req: Request): Promise<void> => {
  const filesWithIndexes = files.map((f) => {
    const index = getUploadIndex(f.filename)
    return {
      ratingID: req.params.ratingID,
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
  addRating,
  getRatings,
  getRatingByID,
  updateRating,
  deleteRating,
  uploadRatingImages
}
