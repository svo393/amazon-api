import Router from 'express'
import answerCommentService from '../services/answerCommentService'
import answerService from '../services/answerService'
import voteService from '../services/voteService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import { checkAnswerUpdate, checkMediaUpload, checkNewAnswerComment, checkNewVote } from '../utils/inputValidator'
import { multerUpload, requireAuth, requireCreator, requireCreatorOrAdmin } from '../utils/middleware'

const router = Router()

router.get('/:answerID', async (req, res) => {
  const answer = await answerService.getAnswerByID(req)
  res.json(answer)
})

router.put('/:answerID', requireCreatorOrAdmin('answers', 'answerID', 'params'), async (req, res) => {
  const answerUpdateInput = checkAnswerUpdate(req)
  const updatedAnswer = await answerService.updateAnswer(answerUpdateInput, req)
  res.json(updatedAnswer)
})

router.delete('/:answerID', requireCreator('answers', 'answerID', 'params'), async (req, res) => {
  await answerService.deleteAnswer(req)
  res.status(204).end()
})

router.post('/:answerID/comments', requireAuth, async (req, res) => {
  const answerCommentCreateInput = checkNewAnswerComment(req)
  const addedAnswerComment = await answerCommentService.addAnswerComment(answerCommentCreateInput, req)
  res.status(201).json(addedAnswerComment)
})

router.get('/:answerID/comments', async (req, res) => {
  const answerComments = await answerCommentService.getCommentsByAnswer(req)
  res.json(answerComments)
})

router.post('/:answerID/upload', requireCreator('answers', 'answerID', 'params'), multerUpload.array('answerImages', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const answerImages = checkMediaUpload(req)
  answerService.uploadAnswerImages(answerImages, req)
  res.status(204).end()
})

router.post('/:answerID/comments/:answerCommentID/upload', requireCreator('answerComments', 'answerCommentID', 'params'), multerUpload.array('answerCommentImages', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const answerCommentImages = checkMediaUpload(req)
  answerCommentService.uploadAnswerCommentImages(answerCommentImages, req)
  res.status(204).end()
})

router.post('/:answerID/votes', requireAuth, async (req, res) => {
  const voteCreateInput = checkNewVote(req)
  const addedVote = await voteService.addVote(voteCreateInput, req)
  res.status(201).json(addedVote)
})

export default router
