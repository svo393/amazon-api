import Router from 'express'
import searchService from '../services/searchService'
import {
  checkAskFilters,
  checkSearchFilters
} from '../utils/typeGuard'

const router = Router()

router.get('/ask/:productID', async (req, res) => {
  const askFiltersInput = checkAskFilters(req)
  const ask = await searchService.getAsk(askFiltersInput, req)
  res.json(ask)
})

router.get('/', async (req, res) => {
  const searchFiltersInput = checkSearchFilters(req)
  const search = await searchService.getSearch(searchFiltersInput)
  res.json(search)
})

export default router
