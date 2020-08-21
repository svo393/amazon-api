import { Request } from 'express'
import R from 'ramda'
import { BatchWithCursor, CursorInput, Image, ReviewComment, ReviewCommentCreateInput, ReviewCommentUpdateInput, ReviewCommentWithUser, Vote } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import getCursor from '../utils/getCursor'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addReviewComment = async (reviewCommentInput: ReviewCommentCreateInput, req: Request): Promise<ReviewComment> => {
  const now = new Date()

  const [ addedReviewComment ]: ReviewComment[] = await db('reviewComments')
    .insert({
      ...reviewCommentInput,
      userID: req.session?.userID,
      createdAt: now,
      updatedAt: now,
      reviewID: req.params.reviewID
    }, [ '*' ])

  return addedReviewComment
}

const getCommentsByReview = async (cursorInput: CursorInput, req: Request): Promise<BatchWithCursor<ReviewComment> & { reviewID: number }> => {
  const { startCursor, limit = 5, sortBy = 'createdAt_desc' } = cursorInput
  const { reviewID } = req.params

  let reviewComments = await db('reviewComments as rc')
    .select(
      'rc.reviewCommentID',
      'rc.parentReviewCommentID',
      'rc.createdAt',
      'rc.updatedAt',
      'rc.content',
      'rc.moderationStatus',
      'rc.userID',
      'rc.reviewID',
      'u.avatar',
      'u.name as userName'
    )
    .join('users as u', 'rc.userID', 'u.userID')
    .where('reviewID', reviewID)
    .andWhere('rc.moderationStatus', 'APPROVED')

  reviewComments = reviewComments
    .map((rc) => ({
      ...R.omit([ 'userName', 'userEmail', 'avatar', 'userID' ], rc),
      author: { avatar: rc.avatar, name: rc.userName, userID: rc.userID }
    }))

  reviewComments = sortItems(reviewComments, sortBy)

  return {
    ...getCursor({
      startCursor,
      limit,
      idProp: 'reviewCommentID',
      data: reviewComments
    }),
    reviewID: Number(reviewID)
  }
}

const getReviewCommentByID = async (req: Request): Promise<ReviewCommentWithUser> => {
  const { reviewCommentID } = req.params

  const reviewComment = await db<ReviewComment>('reviewComments as rc')
    .first(
      'rc.reviewCommentID',
      'rc.createdAt',
      'rc.updatedAt',
      'rc.content',
      'rc.moderationStatus',
      'rc.userID',
      'rc.reviewID',
      'rc.parentReviewCommentID',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .where('reviewCommentID', reviewCommentID)
    .join('users as u', 'rc.userID', 'u.userID')

  if (reviewComment === undefined) throw new StatusError(404, 'Not Found')

  const images = await db<Image>('images')
    .where('reviewCommentID', reviewCommentID)

  const _reviewComment: ReviewCommentWithUser = {
    ...(R.omit([ 'userName', 'userEmail', 'avatar', 'userID' ], reviewComment) as ReviewComment),
    images,
    author: {
      avatar: reviewComment.avatar,
      name: reviewComment.userName,
      email: reviewComment.userEmail,
      userID: reviewComment.userID
    }
  }

  ![ 'ROOT', 'ADMIN' ].includes(req.session?.role) &&
    delete _reviewComment.author.email

  return _reviewComment
}

const updateReviewComment = async (reviewCommentInput: ReviewCommentUpdateInput, req: Request): Promise<ReviewComment> => {
  const [ updatedReviewComment ]: ReviewComment[] = await db('reviewComments')
    .update({
      ...reviewCommentInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('reviewCommentID', req.params.reviewCommentID)

  if (updatedReviewComment === undefined) throw new StatusError(404, 'Not Found')
  return updatedReviewComment
}

const deleteReviewComment = async (req: Request): Promise<void> => {
  const deleteCount = await db('reviewComments')
    .del()
    .where('reviewCommentID', req.params.reviewCommentID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const uploadReviewCommentImages = async (files: Express.Multer.File[], req: Request): Promise<void> => {
  const filesWithIndexes = files.map((f) => {
    const index = getUploadIndex(f.filename)
    return {
      reviewCommentID: req.params.reviewCommentID,
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
  addReviewComment,
  getCommentsByReview,
  getReviewCommentByID,
  updateReviewComment,
  deleteReviewComment,
  uploadReviewCommentImages
}
