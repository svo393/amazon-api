import Router from 'express'
import reviewCommentService from '../services/reviewCommentService'
import reviewService from '../services/reviewService'
import voteService from '../services/voteService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import {
  checkMediaUpload,
  checkNewReviewComment,
  checkNewVote,
  checkReviewComments,
  checkReviewFilters,
  checkReviewUpdate
} from '../utils/inputValidator'
import {
  multerUpload,
  requireAuth,
  requireCreator,
  requireCreatorOrAdmin
} from '../utils/middleware'

const router = Router()

router.get('/', async (req, res) => {
  const reviewsFiltersinput = checkReviewFilters(req)
  const reviews = await reviewService.getReviews(
    reviewsFiltersinput,
    req
  )
  res.json(reviews)
})

router.get('/:reviewID', async (req, res) => {
  const review = await reviewService.getReviewByID(req)
  res.json(review)
})

router.put(
  '/:reviewID',
  requireCreatorOrAdmin('reviews', 'reviewID', 'params'),
  async (req, res) => {
    const reviewUpdateInput = checkReviewUpdate(req)
    const updatedReview = await reviewService.updateReview(
      reviewUpdateInput,
      req
    )
    res.json(updatedReview)
  }
)

router.delete(
  '/:reviewID',
  requireCreator('reviews', 'reviewID', 'params'),
  async (req, res) => {
    await reviewService.deleteReview(req)
    res.status(204).end()
  }
)

router.post('/:reviewID/comments', requireAuth, async (req, res) => {
  const reviewCommentCreateInput = checkNewReviewComment(req)
  const addedReviewComment = await reviewCommentService.addReviewComment(
    reviewCommentCreateInput,
    req
  )
  res.status(201).json(addedReviewComment)
})

router.get('/:reviewID/comments', async (req, res) => {
  const reviewCommentsInput = checkReviewComments(req)
  const reviewComments = await reviewCommentService.getCommentsByReview(
    reviewCommentsInput,
    req
  )
  res.json(reviewComments)
})

router.post(
  '/:reviewID/upload',
  requireCreator('reviews', 'reviewID', 'params'),
  multerUpload.array('reviewImages', 10),
  (req, res) => {
    req.socket.setTimeout(UPLOAD_TIMEOUT)
    const reviewImages = checkMediaUpload(req)
    reviewService.uploadReviewImages(reviewImages, req)
    res.status(204).end()
  }
)

router.post('/:reviewID/votes', requireAuth, async (req, res) => {
  const voteCreateInput = checkNewVote(req)
  const addedVote = await voteService.addVote(voteCreateInput, req)
  res.status(201).json(addedVote)
})

export default router
