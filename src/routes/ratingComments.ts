import Router from 'express'
import ratingCommentService from '../services/ratingCommentService'
import { checkRatingCommentUpdate } from '../utils/inputValidator'
import { requireCreator, requireCreatorOrAdmin } from '../utils/middleware'

const router = Router()

router.get('/:ratingCommentID', async (req, res) => {
  const ratingComment = await ratingCommentService.getRatingCommentByID(req)
  res.json(ratingComment)
})

router.put('/:ratingCommentID', requireCreatorOrAdmin('ratingComments', 'ratingCommentID', 'params'), async (req, res) => {
  const ratingCommentUpdateInput = checkRatingCommentUpdate(req)
  const updatedRatingComment = await ratingCommentService.updateRatingComment(ratingCommentUpdateInput, req)
  res.json(updatedRatingComment)
})

router.delete('/:ratingCommentID', requireCreator('ratingComments', 'ratingCommentID', 'params'), async (req, res) => {
  await ratingCommentService.deleteRatingComment(req)
  res.status(204).end()
})

export default router
