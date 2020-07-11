import Router from 'express'
import ratingCommentService from '../services/ratingCommentService'
import ratingService from '../services/ratingService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import { checkMediaUpload, checkNewRating, checkNewRatingComment, checkRatingFilters, checkRatingUpdate } from '../utils/inputValidator'
import { isCreator, isCreatorOrAdmin, isAuthenticated, multerUpload } from '../utils/middleware'

const router = Router()

router.post('/', isAuthenticated, async (req, res) => {
  const ratingCreateInput = checkNewRating(req)
  const addedRating = await ratingService.addRating(ratingCreateInput, res)
  res.status(201).json(addedRating)
})

router.get('/', async (req, res) => {
  const ratingsFiltersinput = checkRatingFilters(req)
  const ratings = await ratingService.getRatings(ratingsFiltersinput)
  res.json(ratings)
})

router.get('/:ratingID', async (req, res) => {
  const rating = await ratingService.getRatingByID(req)
  res.json(rating)
})

router.put('/:ratingID', isCreatorOrAdmin('ratings', 'ratingID', 'params'), async (req, res) => {
  const ratingUpdateInput = checkRatingUpdate(req)
  const updatedRating = await ratingService.updateRating(ratingUpdateInput, req)
  res.json(updatedRating)
})

router.delete('/:ratingID', isCreator('ratings', 'ratingID', 'params'), async (req, res) => {
  await ratingService.deleteRating(req)
  res.status(204).end()
})

router.post('/comments', isAuthenticated, async (req, res) => {
  const ratingCommentCreateInput = checkNewRatingComment(req)
  const addedRatingComment = await ratingCommentService.addRatingComment(ratingCommentCreateInput, res)
  res.status(201).json(addedRatingComment)
})

router.get('/:ratingID/comments', async (req, res) => {
  const ratingComments = await ratingCommentService.getCommentsByRating(req)
  res.json(ratingComments)
})

router.post('/:ratingID/upload', isCreator('ratings', 'ratingID', 'params'), multerUpload.array('ratingImages', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const ratingImages = checkMediaUpload(req)
  ratingService.uploadRatingImages(ratingImages, req, res)
  res.status(204).end()
})

router.post('/:ratingID/comments/:ratingCommentID/upload', isCreator('ratingComments', 'ratingCommentID', 'params'), multerUpload.array('ratingCommentImages', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const ratingCommentImages = checkMediaUpload(req)
  ratingCommentService.uploadRatingCommentImages(ratingCommentImages, req, res)
  res.status(204).end()
})

export default router
