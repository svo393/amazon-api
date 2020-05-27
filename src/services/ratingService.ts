import { Response } from 'express'
import { Rating, RatingCreateInput } from '../types'
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
  return db('ratings')
    .insert({
      ...ratingInput,
      userID: res.locals.userID,
      ratingCreatedAt: now,
      ratingUpdatedAt: now
    }, [ '*' ])
}

// const getRatings = async (ratingInput: RatingFetchInput): Promise<(Rating & { userID?: number })[] | void> => {
//   const { userID, ratingTypeID } = ratingInput

//   if (ratingTypeID) {
//     return await db('ratings')
//       .where('ratingTypeID', ratingTypeID)
//   }

//   if (userID) {
//     return await db('ratings as a')
//       .select('a.ratingID', 'a.addr', 'a.ratingTypeID', 'ua.userID')
//       .joinRaw('JOIN userAdresses as ua USING (ratingID)')
//       .where('ua.userID', userID)
//   }
// }

// const getRatingByID = async (ratingID: number): Promise<Rating> => {
//   const rating = await db<Rating>('ratings')
//     .first()
//     .where('ratingID', ratingID)

//   if (!rating) throw new StatusError(404, 'Not Found')

//   return rating
// }

export default {
  addRating
  // getRatings,
  // getRatingByID
}
