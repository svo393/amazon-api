import Router from 'express'
import ratingCommentService from '../services/ratingCommentService'
import inputValidator from '../utils/inputValidator'
import { isCreator } from '../utils/middleware'

const router = Router()

router.get('/:ratingCommentID', async (req, res) => {
  const ratingComment = await ratingCommentService.getRatingCommentByID(req)
  res.json(ratingComment)
})

router.put('/:ratingCommentID', isCreator('ratingComments', 'ratingCommentID', 'params'), async (req, res) => {
  const ratingCommentUpdateInput = inputValidator.checkRatingCommentUpdate(req)
  const updatedRatingComment = await ratingCommentService.updateRatingComment(ratingCommentUpdateInput, req)
  res.json(updatedRatingComment)
})

export default router
