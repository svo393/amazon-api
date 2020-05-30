import { Request, Response } from 'express'
import { Rating, RatingCreateInput, RatingUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addRating = async (ratingInput: RatingCreateInput, res: Response): Promise<Rating> => {
  const userID = res.locals.userID
  const now = new Date()

  const { rows: [ addedRating ] }: { rows: Rating[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('ratings').insert({
      ...ratingInput,
      userID,
      ratingCreatedAt: now,
      ratingUpdatedAt: now
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

const getRatingsByProduct = async (req: Request): Promise<Rating[]> => {
  return await db('ratings')
    .where('productID', req.params.productID)
}

const getRatingByID = async (req: Request): Promise<Rating> => {
  const rating = await db<Rating>('ratings')
    .first()
    .where('ratingID', req.params.ratingID)

  if (!rating) throw new StatusError(404, 'Not Found')
  return rating
}

const updateRating = async (ratingInput: RatingUpdateInput, req: Request): Promise<Rating> => {
  const [ updatedRating ]: Rating[] = await db<Rating>('ratings')
    .update({ ...ratingInput }, [ '*' ])
    .where('ratingID', req.params.ratingID)

  if (!updatedRating) throw new StatusError(404, 'Not Found')
  return updatedRating
}

const deleteRating = async (req: Request): Promise<void> => {
  const deleteCount = await db<Rating>('ratings')
    .del()
    .where('ratingID', req.params.ratingID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addRating,
  getRatingsByUser,
  getRatingsByProduct,
  getRatingByID,
  updateRating,
  deleteRating
}
