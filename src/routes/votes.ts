import Router from 'express'
import voteService from '../services/voteService'
import { checkVoteFilters } from '../utils/inputValidator'

const router = Router()

router.get('/', async (req, res) => {
  const votesFiltersInput = checkVoteFilters(req)
  const votes = await voteService.getVotes(votesFiltersInput)
  res.json(votes)
})

export default router
