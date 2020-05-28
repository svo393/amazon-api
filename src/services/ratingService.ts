import { Response, Request } from 'express'
import { Rating, RatingCreateInput, RatingUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addRating = async (ratingInput: RatingCreateInput, res: Response): Promise<Rating> => {
  const userID = res.locals.userID
  const { productID } = ratingInput

  const [ existingRating ] = await db<Rating>('ratings')
    .where('userID', userID)
    .andWhere('productID', productID)

  if (existingRating) {
    throw new StatusError(409, 'You\'ve already left a review for this product')
  }

  const now = new Date()

  const [ addedRating ]: Rating[] = await db('ratings')
    .insert({
      ...ratingInput,
      userID: res.locals.userID,
      ratingCreatedAt: now,
      ratingUpdatedAt: now
    }, [ '*' ])

  return addedRating
}

const getRatingsByUser = async (req: Request): Promise<Rating[] | void> => {
  return await db('ratings')
    .where('userID', req.params.userID)
}

const getRatingsByProduct = async (req: Request): Promise<Rating[] | void> => {
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

export default {
  addRating,
  getRatingsByUser,
  getRatingsByProduct,
  getRatingByID,
  updateRating
}
