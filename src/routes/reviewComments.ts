import Router from 'express'
import reviewCommentService from '../services/reviewCommentService'
import { checkReviewCommentUpdate } from '../utils/inputValidator'
import { requireCreator, requireCreatorOrAdmin } from '../utils/middleware'

const router = Router()

router.get('/:reviewCommentID', async (req, res) => {
  const reviewComment = await reviewCommentService.getReviewCommentByID(req)
  res.json(reviewComment)
})

router.put('/:reviewCommentID', requireCreatorOrAdmin('reviewComments', 'reviewCommentID', 'params'), async (req, res) => {
  const reviewCommentUpdateInput = checkReviewCommentUpdate(req)
  const updatedReviewComment = await reviewCommentService.updateReviewComment(reviewCommentUpdateInput, req)
  res.json(updatedReviewComment)
})

router.delete('/:reviewCommentID', requireCreator('reviewComments', 'reviewCommentID', 'params'), async (req, res) => {
  await reviewCommentService.deleteReviewComment(req)
  res.status(204).end()
})

export default router