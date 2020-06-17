import Router from 'express'
import feedService from '../services/feedService'

const router = Router()

router.get('/', async (req, res) => {
  const feed = await feedService.getFeed(req)
  res.json(feed)
})

export default router
