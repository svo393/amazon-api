import Router from 'express'
import ratingCommentService from '../services/ratingCommentService'
import ratingService from '../services/ratingService'
import voteService from '../services/voteService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import { checkMediaUpload, checkNewRatingComment, checkNewVote, checkRatingFilters, checkRatingUpdate } from '../utils/inputValidator'
import { multerUpload, requireAuth, requireCreator, requireCreatorOrAdmin } from '../utils/middleware'

const router = Router()

router.get('/', async (req, res) => {
  const ratingsFiltersinput = checkRatingFilters(req)
  const ratings = await ratingService.getRatings(ratingsFiltersinput, req)
  res.json(ratings)
})

router.get('/:ratingID', async (req, res) => {
  const rating = await ratingService.getRatingByID(req)
  res.json(rating)
})

router.put('/:ratingID', requireCreatorOrAdmin('ratings', 'ratingID', 'params'), async (req, res) => {
  const ratingUpdateInput = checkRatingUpdate(req)
  const updatedRating = await ratingService.updateRating(ratingUpdateInput, req)
  res.json(updatedRating)
})

router.delete('/:ratingID', requireCreator('ratings', 'ratingID', 'params'), async (req, res) => {
  await ratingService.deleteRating(req)
  res.status(204).end()
})

router.post('/:ratingID/comments', requireAuth, async (req, res) => {
  const ratingCommentCreateInput = checkNewRatingComment(req)
  const addedRatingComment = await ratingCommentService.addRatingComment(ratingCommentCreateInput, req)
  res.status(201).json(addedRatingComment)
})

router.get('/:ratingID/comments', async (req, res) => {
  const ratingComments = await ratingCommentService.getCommentsByRating(req)
  res.json(ratingComments)
})

router.post('/:ratingID/upload', requireCreator('ratings', 'ratingID', 'params'), multerUpload.array('ratingImages', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const ratingImages = checkMediaUpload(req)
  ratingService.uploadRatingImages(ratingImages, req)
  res.status(204).end()
})

router.post('/:ratingID/comments/:ratingCommentID/upload', requireCreator('ratingComments', 'ratingCommentID', 'params'), multerUpload.array('ratingCommentImages', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const ratingCommentImages = checkMediaUpload(req)
  ratingCommentService.uploadRatingCommentImages(ratingCommentImages, req)
  res.status(204).end()
})

router.post('/:ratingID/votes', requireAuth, async (req, res) => {
  const voteCreateInput = checkNewVote(req)
  const addedVote = await voteService.addVote(voteCreateInput, req)
  res.status(201).json(addedVote)
})

export default router
