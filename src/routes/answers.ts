import Router from 'express'
import answerService from '../services/answerService'
import voteService from '../services/voteService'
import {
  checkAnswerUpdate,
  checkNewVote
} from '../utils/inputValidator'
import {
  requireAuth,
  requireCreator,
  requireCreatorOrAdmin
} from '../utils/middleware'

const router = Router()

router.get('/:answerID', async (req, res) => {
  const answer = await answerService.getAnswerByID(req)
  res.json(answer)
})

router.put(
  '/:answerID',
  requireCreatorOrAdmin('answers', 'answerID', 'params'),
  async (req, res) => {
    const answerUpdateInput = checkAnswerUpdate(req)
    const updatedAnswer = await answerService.updateAnswer(
      answerUpdateInput,
      req
    )
    res.json(updatedAnswer)
  }
)

router.delete(
  '/:answerID',
  requireCreator('answers', 'answerID', 'params'),
  async (req, res) => {
    const deletedAnswer = await answerService.deleteAnswer(req)
    res.json(deletedAnswer)
  }
)

router.post('/:answerID/votes', requireAuth, async (req, res) => {
  const voteCreateInput = checkNewVote(req)
  const addedVote = await voteService.addVote(voteCreateInput, req)
  res.status(201).json(addedVote)
})

export default router
