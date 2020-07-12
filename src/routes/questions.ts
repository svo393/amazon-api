import Router from 'express'
import answerService from '../services/answerService'
import questionService from '../services/questionService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import { checkMediaUpload, checkNewAnswer, checkNewQuestion, checkQuestionUpdate } from '../utils/inputValidator'
import { requireCreator, requireCreatorOrAdmin, requireAuth, multerUpload } from '../utils/middleware'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const questionCreateInput = checkNewQuestion(req)
  const addedQuestion = await questionService.addQuestion(questionCreateInput, req)
  res.status(201).json(addedQuestion)
})

router.get('/:questionID', async (req, res) => {
  const question = await questionService.getQuestionByID(req)
  res.json(question)
})

router.put('/:questionID', requireCreatorOrAdmin('questions', 'questionID', 'params'), async (req, res) => {
  const questionUpdateInput = checkQuestionUpdate(req)
  const updatedQuestion = await questionService.updateQuestion(questionUpdateInput, req)
  res.json(updatedQuestion)
})

router.delete('/:questionID', requireCreator('questions', 'questionID', 'params'), async (req, res) => {
  await questionService.deleteQuestion(req)
  res.status(204).end()
})

router.post('/answers', requireAuth, async (req, res) => {
  const answerCreateInput = checkNewAnswer(req)
  const addedAnswer = await answerService.addAnswer(answerCreateInput, req)
  res.status(201).json(addedAnswer)
})

router.get('/:questionID/answers', async (req, res) => {
  const answers = await answerService.getAnswersByQuestion(req)
  res.json(answers)
})

router.post('/:questionID/upload', requireCreator('questions', 'questionID', 'params'), multerUpload.array('questionImages', 4), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const questionImages = checkMediaUpload(req)
  questionService.uploadQuestionImages(questionImages, req)
  res.status(204).end()
})

export default router
