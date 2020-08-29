import { Request } from 'express'
import Knex from 'knex'
import { omit } from 'ramda'
import { BatchWithCursor, CursorInput, ReviewComment, ReviewCommentCreateInput, ReviewCommentUpdateInput, ReviewCommentWithUser, User } from '../types'
import { db, dbTrans } from '../utils/db'
import getCursor from '../utils/getCursor'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addReviewComment = async (reviewCommentInput: ReviewCommentCreateInput, req: Request): Promise<ReviewCommentWithUser> => {
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    if (reviewCommentInput.parentReviewCommentID !== undefined) {
      const parentReviewComment = await trx<ReviewComment>('reviewComments')
        .first('userID')
        .where('reviewCommentID', reviewCommentInput.parentReviewCommentID)

      if (parentReviewComment?.userID === req.session?.userID) throw new StatusError(403, 'Forbidden')
    }

    const user = await trx<User>('users')
      .first('name', 'avatar', 'userID')
      .where('userID', req.session?.userID)

    if (user === undefined) throw new StatusError()

    const [ addedReviewComment ]: ReviewComment[] = await trx('reviewComments')
      .insert({
        ...reviewCommentInput,
        userID: req.session?.userID,
        createdAt: now,
        updatedAt: now,
        reviewID: req.params.reviewID
      }, [ '*' ])

    return {
      ...addedReviewComment,
      hasChildren: false,
      author: {
        avatar: user.avatar,
        name: user.name,
        userID: user.userID
      }
    }
  })
}

const getCommentsByReview = async (cursorInput: CursorInput, req: Request): Promise<BatchWithCursor<ReviewComment> & { reviewID: number }> => {
  const { startCursor, limit = 5, sortBy = 'createdAt_desc' } = cursorInput
  const { reviewID } = req.params

  let reviewComments: (Partial<ReviewComment & { avatar?: boolean; userName?: string; hasChildren?: boolean }>)[] = await db('reviewComments as rc')
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
    .where('rc.reviewID', reviewID)
    .where((builder) => {
      builder
        .where('rc.moderationStatus', 'APPROVED')
        .orWhere('rc.userID', req.session?.userID ?? 0)
    })

  console.info('reviewComments', reviewComments)

  const childrenReviewComment = await db<ReviewComment>('reviewComments')
    .select('parentReviewCommentID')
    .whereNotNull('parentReviewCommentID')

  const parentReviewCommentIDs = childrenReviewComment
    .map((rc) => rc.parentReviewCommentID)

  reviewComments = reviewComments
    .map((rc) => ({
      ...omit([ 'userName', 'avatar', 'userID' ], rc),
      hasChildren: parentReviewCommentIDs.includes(rc.reviewCommentID),
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

  const childReviewComment = await db<ReviewComment>('reviewComments')
    .first('parentReviewCommentID')
    .where('parentReviewCommentID', req.params.reviewCommentID)

  const _reviewComment: ReviewCommentWithUser = {
    ...(omit([ 'userName', 'userEmail', 'avatar', 'userID' ], reviewComment) as ReviewComment),
    hasChildren: childReviewComment !== undefined,
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

const deleteReviewComment = async (req: Request): Promise<ReviewComment> => {
  const reviewComment = await db<ReviewComment>('reviewComments')
    .first()
    .where('reviewCommentID', req.params.reviewCommentID)

  const deleteCount = await db('reviewComments')
    .del()
    .where('reviewCommentID', req.params.reviewCommentID)

  if (deleteCount === 0 || reviewComment === undefined) throw new StatusError(404, 'Not Found')

  return reviewComment
}

export default {
  addReviewComment,
  getCommentsByReview,
  getReviewCommentByID,
  updateReviewComment,
  deleteReviewComment
}
