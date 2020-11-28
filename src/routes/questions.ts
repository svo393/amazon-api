import Router from 'express'
import answerService from '../services/answerService'
import questionService from '../services/questionService'
import voteService from '../services/voteService'
import {
  checkAnswers,
  checkNewAnswer,
  checkNewVote,
  checkQuestionUpdate
} from '../utils/typeGuard'
import {
  requireAuth,
  requireCreator,
  requireCreatorOrAdmin
} from '../utils/middleware'

const router = Router()

router.get('/:questionID', async (req, res) => {
  const question = await questionService.getQuestionByID(req)
  res.json(question)
})

router.put(
  '/:questionID',
  requireCreatorOrAdmin('questions', 'questionID', 'params'),
  async (req, res) => {
    const questionUpdateInput = checkQuestionUpdate(req)
    const updatedQuestion = await questionService.updateQuestion(
      questionUpdateInput,
      req
    )
    res.json(updatedQuestion)
  }
)

router.delete(
  '/:questionID',
  requireCreator('questions', 'questionID', 'params'),
  async (req, res) => {
    await questionService.deleteQuestion(req)
    res.status(204).end()
  }
)

router.post('/:questionID/answers', requireAuth, async (req, res) => {
  const answerCreateInput = checkNewAnswer(req)
  const addedAnswer = await answerService.addAnswer(
    answerCreateInput,
    req
  )
  res.status(201).json(addedAnswer)
})

router.get('/:questionID/answers', async (req, res) => {
  const answersInput = checkAnswers(req)
  const answers = await answerService.getAnswersByQuestion(
    answersInput,
    req
  )
  res.json(answers)
})

router.post('/:questionID/votes', requireAuth, async (req, res) => {
  const voteCreateInput = checkNewVote(req)
  const addedVote = await voteService.addVote(voteCreateInput, req)
  res.status(201).json(addedVote)
})

export default router
