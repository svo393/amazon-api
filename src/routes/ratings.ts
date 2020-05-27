import Router from 'express'
import ratingService from '../services/ratingService'
import inputValidator from '../utils/inputValidator'
import { isLoggedIn } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const ratingCreateInput = inputValidator.checkNewRating(req.body)
  const addedRating = await ratingService.addRating(ratingCreateInput, res)
  res.status(201).json(addedRating)
})

// router.get('/', async (req, res) => {
//   const ratingFetchInput = inputValidator.checkRatingsFetch(req.query)
//   const ratings = await ratingService.getRatings(ratingFetchInput)
//   res.json(ratings)
// })

// router.get('/:ratingID', async (req, res) => {
//   const rating = await ratingService.getRatingByID(Number(req.params.ratingID))
//   res.json(rating)
// })

export default router
