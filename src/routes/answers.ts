import Router from 'express'
import answerCommentService from '../services/answerCommentService'
import answerService from '../services/answerService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import { checkAnswerUpdate, checkMediaUpload, checkNewAnswerComment } from '../utils/inputValidator'
import { isCreator, isCreatorOrAdmin, isLoggedIn, multerUpload } from '../utils/middleware'

const router = Router()

router.get('/:answerID', async (req, res) => {
  const answer = await answerService.getAnswerByID(req)
  res.json(answer)
})

router.put('/:answerID', isCreatorOrAdmin('answers', 'answerID', 'params'), async (req, res) => {
  const answerUpdateInput = checkAnswerUpdate(req)
  const updatedAnswer = await answerService.updateAnswer(answerUpdateInput, req)
  res.json(updatedAnswer)
})

router.delete('/:answerID', isCreator('answers', 'answerID', 'params'), async (req, res) => {
  await answerService.deleteAnswer(req)
  res.status(204).end()
})

router.post('/comments', isLoggedIn, async (req, res) => {
  const answerCommentCreateInput = checkNewAnswerComment(req)
  const addedAnswerComment = await answerCommentService.addAnswerComment(answerCommentCreateInput, res)
  res.status(201).json(addedAnswerComment)
})

router.get('/:answerID/comments', async (req, res) => {
  const answerComments = await answerCommentService.getCommentsByAnswer(req)
  res.json(answerComments)
})

router.post('/:answerID/upload', isCreator('answers', 'answerID', 'params'), multerUpload.array('answerMedia', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const answerMedia = checkMediaUpload(req)
  answerService.uploadAnswerImages(answerMedia, req, res)
  res.status(204).end()
})

router.post('/:answerID/comments/:answerCommentID/upload', isCreator('answerComments', 'answerCommentID', 'params'), multerUpload.array('answerCommentMedia', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const answerMedia = checkMediaUpload(req)
  answerCommentService.uploadAnswerCommentImages(answerMedia, req, res)
  res.status(204).end()
})

export default router
