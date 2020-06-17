import Router from 'express'
import feedService from '../services/feedService'
import { checkFeedFilters } from '../utils/inputValidator'

const router = Router()

router.get('/', async (req, res) => {
  checkFeedFilters(req)
  const feed = await feedService.getFeed(req)
  res.json(feed)
})

export default router
