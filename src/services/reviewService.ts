import { Request } from 'express'
import R from 'ramda'
import { Image, Review, ReviewCreateInput, ReviewsFiltersInput, ReviewUpdateInput, ReviewWithUser, Vote } from '../types'
import { defaultLimit, imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addReview = async (reviewInput: ReviewCreateInput, req: Request): Promise<Review> => {
  const now = new Date()

  const { rows: [ addedReview ] }: { rows: Review[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('reviews').insert({
      ...reviewInput,
      userID: req.session?.userID,
      createdAt: now,
      updatedAt: now,
      groupID: req.params.groupID
    }) ]
  )

  if (addedReview === undefined) {
    throw new StatusError(409, 'You\'ve already left a review for this product')
  }
  return addedReview
}

const getReviews = async (reviewsFiltersInput: ReviewsFiltersInput, req: Request): Promise<{ batch: Review[]; totalCount: number }> => {
  const {
    page = 1,
    sortBy = 'createdAt_desc',
    q,
    groupID,
    userEmail,
    moderationStatuses,
    isVerified,
    createdFrom,
    createdTo,
    starsMin,
    starsMax,
    votesMin,
    votesMax
  } = reviewsFiltersInput

  const userHasPermission = [ 'ROOT', 'ADMIN' ].includes(req.session?.role)

  let reviews: (Review & { votes: number; userEmail: string })[] = await db('reviews as r')
    .select(
      'r.reviewID',
      'r.createdAt',
      'r.updatedAt',
      'r.title',
      'r.content',
      'r.stars',
      'r.isVerified',
      'r.moderationStatus',
      'r.userID',
      'r.groupID',
      'u.email as userEmail'
    )
    .join('users as u', 'r.userID', 'u.userID')
    .groupBy('r.reviewID', 'userEmail')

  // TODO move votes query after sorting
  const votes = await db<Vote>('votes')
    .whereNotNull('reviewID')

  reviews = reviews
    .map((r) => {
      const voteSum = votes
        .filter((v) => v.reviewID === r.reviewID)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)
      return { ...r, votes: voteSum }
    })

  if (groupID !== undefined) {
    reviews = reviews
      .filter((r) => r.groupID === groupID)
  }

  if (userHasPermission && userEmail !== undefined) {
    reviews = reviews
      .filter((r) => r.userEmail?.toLowerCase().includes(userEmail.toLowerCase()))
  }

  if (moderationStatuses !== undefined) {
    reviews = reviews
      .filter((r) => moderationStatuses.split(',').includes(r.moderationStatus))
  }

  if (isVerified !== undefined) {
    reviews = reviews
      .filter((r) => r.isVerified === isVerified)
  }

  if (createdFrom !== undefined) {
    reviews = reviews
      .filter((r) => r.createdAt >= new Date(createdFrom))
  }

  if (createdTo !== undefined) {
    reviews = reviews
      .filter((r) => r.createdAt <= new Date(createdTo))
  }

  if (starsMin !== undefined) {
    reviews = reviews
      .filter((r) => r.stars >= starsMin)
  }

  if (starsMax !== undefined) {
    reviews = reviews
      .filter((r) => r.stars <= starsMax)
  }

  if (votesMin !== undefined) {
    reviews = reviews
      .filter((r) => r.votes >= votesMin)
  }

  if (votesMax !== undefined) {
    reviews = reviews
      .filter((r) => r.votes <= votesMax)
  }

  if (q !== undefined) {
    reviews = reviews
      .filter((_, i) =>
        fuseIndexes(reviews, [ 'title', 'content' ], q).includes(i))
  }

  const _reviews = userHasPermission
    ? reviews
    : reviews.map((r) => ({ ...R.omit([ 'userEmail' ], r) }))

  const reviewsSorted = sortItems(_reviews, sortBy)

  return {
    batch: reviewsSorted.slice((page - 1) * defaultLimit, (page - 1) * defaultLimit + defaultLimit),
    totalCount: _reviews.length
  }
}

const getReviewByID = async (req: Request): Promise<ReviewWithUser> => {
  const { reviewID } = req.params

  const review = await db<Review>('reviews as r')
    .first(
      'r.reviewID',
      'r.createdAt',
      'r.updatedAt',
      'r.title',
      'r.content',
      'r.stars',
      'r.isVerified',
      'r.moderationStatus',
      'r.userID',
      'r.groupID',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .where('reviewID', reviewID)
    .join('users as u', 'r.userID', 'u.userID')

  if (review === undefined) throw new StatusError(404, 'Not Found')

  const images = await db<Image>('images')
    .where('reviewID', reviewID)

  const votes = await db<Vote>('votes')
    .where('reviewID', reviewID)

  const voteSum = votes.reduce((acc, cur) => (
    acc += cur.vote ? 1 : -1
  ), 0)

  const _review: ReviewWithUser = {
    ...(R.omit([ 'userName', 'userEmail', 'avatar', 'userID' ], review) as Review),
    images,
    votes: voteSum,
    author: {
      avatar: review.avatar,
      name: review.userName,
      email: review.userEmail,
      userID: review.userID
    }
  }

  ![ 'ROOT', 'ADMIN' ].includes(req.session?.role) &&
    delete _review.author.email

  return _review
}

const updateReview = async (reviewInput: ReviewUpdateInput, req: Request): Promise<Review> => {
  const [ updatedReview ]: Review[] = await db('reviews')
    .update({
      ...reviewInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('reviewID', req.params.reviewID)

  if (updatedReview === undefined) throw new StatusError(404, 'Not Found')
  return updatedReview
}

const deleteReview = async (req: Request): Promise<void> => {
  const deleteCount = await db('reviews')
    .del()
    .where('reviewID', req.params.reviewID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const uploadReviewImages = async (files: Express.Multer.File[], req: Request): Promise<void> => {
  const filesWithIndexes = files.map((f) => {
    const index = getUploadIndex(f.filename)
    return {
      reviewID: req.params.reviewID,
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
  addReview,
  getReviews,
  getReviewByID,
  updateReview,
  deleteReview,
  uploadReviewImages
}
