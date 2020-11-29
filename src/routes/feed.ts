import Router from 'express'
import feedService from '../services/feedService'
import { checkFeedFilters } from '../utils/typeGuard'
import { requireAdmin } from '../utils/middleware'

const router = Router()

router.get('/', requireAdmin, async (req, res) => {
  const feedFiltersInput = checkFeedFilters(req)
  const feed = await feedService.getFeed(feedFiltersInput)
  res.json(feed)
})

export default router
