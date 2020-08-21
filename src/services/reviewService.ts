import { Request } from 'express'
import R, { flatten } from 'ramda'
import { BatchWithCursor, Image, Review, ReviewCreateInput, ReviewsFiltersInput, ReviewUpdateInput, ReviewWithUser, Vote } from '../types'
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

const getReviews = async (reviewsFiltersInput: ReviewsFiltersInput, req: Request): Promise<BatchWithCursor<Review & { images: Image[]; votes: number; upVotes: number }> & { groupID?: number; images?: Image[] }> => {
  const {
    page = 1,
    limit,
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

  let reviews: any[] = await db('reviews as r')
    .select(
      'r.reviewID',
      'r.createdAt',
      'r.updatedAt',
      'r.title',
      'r.variation',
      'r.content',
      'r.stars',
      'r.isVerified',
      'r.moderationStatus',
      'r.userID',
      'r.groupID',
      'u.avatar',
      'u.email as userEmail',
      'u.name as userName'
    )
    .count('rc.reviewCommentID as reviewCommentCount')
    .leftJoin('users as u', 'r.userID', 'u.userID')
    .leftJoin('reviewComments as rc', 'r.reviewID', 'rc.reviewID')
    .groupBy(
      'r.reviewID',
      'u.avatar',
      'u.name',
      'u.email'
    )

  const images = await db<Image>('images')
    .whereNotNull('reviewID')

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

      const upVoteSum = votes
        .filter((v) => v.reviewID === r.reviewID && v.vote)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)
      return {
        ...R.omit([ 'userName', 'userEmail', 'avatar', 'userID' ], r),
        images: images.filter((i) => i.reviewID === r.reviewID),
        votes: voteSum,
        reviewCommentCount: parseInt(r.reviewCommentCount),
        upVotes: upVoteSum,
        author: { avatar: r.avatar, name: r.userName, userID: r.userID }
      }
    })

  let reviewIDs: number[]

  if (groupID !== undefined) {
    reviews = reviews
      .filter((r) => r.groupID === groupID)

    reviewIDs = flatten(reviews.map((r) => r.reviewID))
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

  const totalCount = _reviews.length
  const _limit = limit ?? defaultLimit
  const end = (page - 1) * _limit + _limit

  return {
    batch: reviewsSorted.slice((page - 1) * _limit, end),
    totalCount,
    hasNextPage: end < totalCount,
    groupID,
    images: groupID !== undefined ? images.filter((i) => reviewIDs.includes(i.reviewID as number)) : undefined
  }
}

const getReviewByID = async (req: Request): Promise<ReviewWithUser> => {
  const { reviewID } = req.params

  const review: any = await db('reviews as r')
    .first(
      'r.reviewID',
      'r.createdAt',
      'r.updatedAt',
      'r.title',
      'r.variation',
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
    .count('rc.reviewCommentID as reviewCommentCount')
    .where('r.reviewID', reviewID)
    .leftJoin('users as u', 'r.userID', 'u.userID')
    .leftJoin('reviewComments as rc', 'r.reviewID', 'rc.reviewID')
    .groupBy(
      'r.reviewID',
      'u.avatar',
      'u.name',
      'u.email'
    )

  if (review === undefined) throw new StatusError(404, 'Not Found')

  const images = await db<Image>('images')
    .where('reviewID', reviewID)

  const votes = await db<Vote>('votes')
    .where('reviewID', reviewID)

  const voteSum = votes.reduce((acc, cur) => (
    acc += cur.vote ? 1 : -1
  ), 0)

  const upVoteSum = votes
    .filter((v) => v.vote)
    .reduce((acc, cur) => (
      acc += cur.vote ? 1 : -1
    ), 0)

  const _review: ReviewWithUser = {
    ...(R.omit([ 'userName', 'userEmail', 'avatar', 'userID' ], review) as Review),
    images,
    votes: voteSum,
    reviewCommentCount: parseInt(review.reviewCommentCount),
    upVotes: upVoteSum,
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
