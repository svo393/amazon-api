import Router from 'express'
import followerService from '../services/followerService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isSameUser(req, res, 'body')
  const followerCreateInput = inputValidator.checkNewFollower(req.body)
  const addedFollower = await followerService.addFollower(followerCreateInput)
  res.status(201).json(addedFollower)
})

router.get('/', async (req, res) => {
  const followerFetchInput = inputValidator.checkFollowersFetch(req.query)
  const followeres = await followerService.getFollowers(followerFetchInput)
  res.json(followeres)
})

router.delete('/:userID/:follows', async (req, res) => {
  shield.isSameUser(req, res, 'params')
  await followerService.deleteFollower(Number(req.params.userID), Number(req.params.follows))
  res.status(204).end()
})

export default router
