import Router from 'express'
import ratingCommentService from '../services/ratingCommentService'
import ratingService from '../services/ratingService'
import { checkNewRating, checkNewRatingComment, checkRatingUpdate } from '../utils/inputValidator'
import { isCreator, isLoggedIn } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const ratingCreateInput = checkNewRating(req)
  const addedRating = await ratingService.addRating(ratingCreateInput, res)
  res.status(201).json(addedRating)
})

router.get('/:ratingID', async (req, res) => {
  const rating = await ratingService.getRatingByID(req)
  res.json(rating)
})

router.put('/:ratingID', isCreator('ratings', 'ratingID', 'params'), async (req, res) => {
  const ratingUpdateInput = checkRatingUpdate(req)
  const updatedRating = await ratingService.updateRating(ratingUpdateInput, req)
  res.json(updatedRating)
})

router.delete('/:ratingID', isCreator('ratings', 'ratingID', 'params'), async (req, res) => {
  await ratingService.deleteRating(req)
  res.status(204).end()
})

router.post('/comments', isLoggedIn, async (req, res) => {
  const ratingCommentCreateInput = checkNewRatingComment(req)
  const addedRatingComment = await ratingCommentService.addRatingComment(ratingCommentCreateInput, res)
  res.status(201).json(addedRatingComment)
})

router.get('/:ratingID/comments', async (req, res) => {
  const ratingComments = await ratingCommentService.getCommentsByRating(req)
  res.json(ratingComments)
})

// router.post('/:ratingID/upload', isAdmin, ratingCommentService.multerUpload.array('ratingMedia', 10), (req, res) => { // TODO
//   const ratingMedia = checkratingMediaUpload(req)
//   ratingCommentService.uploadImages(ratingMedia, req)
//   res.status(204).end()
// })

export default router
