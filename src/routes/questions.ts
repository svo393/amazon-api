import Router from 'express'
import answerService from '../services/answerService'
import questionService from '../services/questionService'
import inputValidator from '../utils/inputValidator'
import { isCreator, isLoggedIn } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const questionCreateInput = inputValidator.checkNewQuestion(req)
  const addedQuestion = await questionService.addQuestion(questionCreateInput, res)
  res.status(201).json(addedQuestion)
})

router.get('/:questionID', async (req, res) => {
  const question = await questionService.getQuestionByID(req)
  res.json(question)
})

router.put('/:questionID', isCreator('questions', 'questionID', 'params'), async (req, res) => {
  const questionUpdateInput = inputValidator.checkQuestionUpdate(req)
  const updatedQuestion = await questionService.updateQuestion(questionUpdateInput, req)
  res.json(updatedQuestion)
})

router.delete('/:questionID', isCreator('questions', 'questionID', 'params'), async (req, res) => {
  await questionService.deleteQuestion(req)
  res.status(204).end()
})

router.post('/answers', isLoggedIn, async (req, res) => {
  const answerCreateInput = inputValidator.checkNewAnswer(req)
  const addedAnswer = await answerService.addAnswer(answerCreateInput, res)
  res.status(201).json(addedAnswer)
})

router.get('/:questionID/answers', async (req, res) => {
  const answers = await answerService.getAnswersByQuestion(req)
  res.json(answers)
})

// router.post('/:questionID/upload', isAdmin, questionCommentService.multerUpload.array('questionMedia', 10), (req, res) => { // TODO
//   const questionMedia = inputValidator.checkquestionMediaUpload(req)
//   questionCommentService.uploadImages(questionMedia, req)
//   res.status(204).end()
// })

export default router
