import Router from 'express'
import answerCommentService from '../services/answerCommentService'
import { checkAnswerCommentUpdate } from '../utils/inputValidator'
import { requireCreator, requireCreatorOrAdmin } from '../utils/middleware'

const router = Router()

router.get('/:answerCommentID', async (req, res) => {
  const answerComment = await answerCommentService.getAnswerCommentByID(req)
  res.json(answerComment)
})

router.put('/:answerCommentID', requireCreatorOrAdmin('answerComments', 'answerCommentID', 'params'), async (req, res) => {
  const answerCommentUpdateInput = checkAnswerCommentUpdate(req)
  const updatedAnswerComment = await answerCommentService.updateAnswerComment(answerCommentUpdateInput, req)
  res.json(updatedAnswerComment)
})

router.delete('/:answerCommentID', requireCreator('answerComments', 'answerCommentID', 'params'), async (req, res) => {
  await answerCommentService.deleteAnswerComment(req)
  res.status(204).end()
})

export default router
