import Router from 'express'
import answerCommentService from '../services/answerCommentService'
import inputValidator from '../utils/inputValidator'
import { isCreator } from '../utils/middleware'

const router = Router()

router.get('/:answerCommentID', async (req, res) => {
  const answerComment = await answerCommentService.getAnswerCommentByID(req)
  res.json(answerComment)
})

router.put('/:answerCommentID', isCreator('answerComments', 'answerCommentID', 'params'), async (req, res) => {
  const answerCommentUpdateInput = inputValidator.checkAnswerCommentUpdate(req)
  const updatedAnswerComment = await answerCommentService.updateAnswerComment(answerCommentUpdateInput, req)
  res.json(updatedAnswerComment)
})

router.delete('/:answerCommentID', isCreator('answerComments', 'answerCommentID', 'params'), async (req, res) => {
  await answerCommentService.deleteAnswerComment(req)
  res.status(204).end()
})

export default router
