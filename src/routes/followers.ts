import Router from 'express'
import followerService from '../services/followerService'
import inputValidator from '../utils/inputValidator'
import { isSameUser } from '../utils/middleware'

const router = Router()

router.post('/', isSameUser('body'), async (req, res) => {
  const followerCreateInput = inputValidator.checkNewFollower(req.body)
  const addedFollower = await followerService.addFollower(followerCreateInput)
  res.status(201).json(addedFollower)
})

router.get('/', async (req, res) => {
  const followerFetchInput = inputValidator.checkFollowersFetch(req.query)
  const followeres = await followerService.getFollowers(followerFetchInput)
  res.json(followeres)
})

router.delete('/:userID/:follows', isSameUser('params'), async (req, res) => {
  await followerService.deleteFollower(Number(req.params.userID), Number(req.params.follows))
  res.status(204).end()
})

export default router
