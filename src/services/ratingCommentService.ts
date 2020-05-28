import { Request, Response } from 'express'
import { RatingComment, RatingCommentCreateInput, RatingCommentUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addRatingComment = async (ratingCommentInput: RatingCommentCreateInput, res: Response): Promise<RatingComment> => {
  const now = new Date()

  const [ addedRatingComment ]: RatingComment[] = await db('ratingComments')
    .insert({
      ...ratingCommentInput,
      userID: res.locals.userID,
      ratingCommentCreatedAt: now,
      ratingCommentUpdatedAt: now
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

  if (!ratingComment) throw new StatusError(404, 'Not Found')
  return ratingComment
}

const updateRatingComment = async (ratingCommentInput: RatingCommentUpdateInput, req: Request): Promise<RatingComment> => {
  const [ updatedRC ]: RatingComment[] = await db<RatingComment>('ratingComments')
    .update({ ...ratingCommentInput }, [ '*' ])
    .where('ratingCommentID', req.params.ratingCommentID)

  if (!updatedRC) throw new StatusError(404, 'Not Found')
  return updatedRC
}

// const getRatingCommentsByProduct = async (req: Request): Promise<RatingComment[]> => {
//   return await db('ratingComments')
//     .where('productID', req.params.productID)
// }

// const deleteRatingComment = async (req: Request): Promise<void> => {
//   const deleteCount = await db<RatingComment>('ratingComments')
//     .del()
//     .where('ratingCommentID', req.params.ratingCommentID)

//   if (deleteCount === 0) throw new StatusError(404, 'Not Found')
// }

export default {
  addRatingComment,
  getCommentsByRating,
  getRatingCommentByID,
  updateRatingComment
  // deleteRatingComment
}
