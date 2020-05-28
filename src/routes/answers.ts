import Router from 'express'
import answerCommentService from '../services/answerCommentService'
import answerService from '../services/answerService'
import inputValidator from '../utils/inputValidator'
import { isCreator, isLoggedIn } from '../utils/middleware'

const router = Router()

router.get('/:answerID', async (req, res) => {
  const answer = await answerService.getAnswerByID(req)
  res.json(answer)
})

router.put('/:answerID', isCreator('answers', 'answerID', 'params'), async (req, res) => {
  const answerUpdateInput = inputValidator.checkAnswerUpdate(req)
  const updatedAnswer = await answerService.updateAnswer(answerUpdateInput, req)
  res.json(updatedAnswer)
})

router.delete('/:answerID', isCreator('answers', 'answerID', 'params'), async (req, res) => {
  await answerService.deleteAnswer(req)
  res.status(204).end()
})

router.post('/comments', isLoggedIn, async (req, res) => {
  const answerCommentCreateInput = inputValidator.checkNewAnswerComment(req)
  const addedAnswerComment = await answerCommentService.addAnswerComment(answerCommentCreateInput, res)
  res.status(201).json(addedAnswerComment)
})

router.get('/:answerID/comments', async (req, res) => {
  const answerComments = await answerCommentService.getCommentsByAnswer(req)
  res.json(answerComments)
})

export default router
