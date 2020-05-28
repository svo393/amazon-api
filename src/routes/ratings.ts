import Router from 'express'
import ratingService from '../services/ratingService'
import inputValidator from '../utils/inputValidator'
import { isCreator, isLoggedIn } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const ratingCreateInput = inputValidator.checkNewRating(req)
  const addedRating = await ratingService.addRating(ratingCreateInput, res)
  res.status(201).json(addedRating)
})

router.get('/:ratingID', async (req, res) => {
  const rating = await ratingService.getRatingByID(req)
  res.json(rating)
})

router.put('/:ratingID', isCreator('ratings', 'ratingID', 'params'), async (req, res) => {
  const ratingInput = inputValidator.checkRatingUpdate(req)
  const updatedRating = await ratingService.updateRating(ratingInput, req)
  res.json(updatedRating)
})

export default router
