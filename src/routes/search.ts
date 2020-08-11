import Router from 'express'
import searchService from '../services/searchService'
import { checkAskFilters } from '../utils/inputValidator'

const router = Router()

router.get('/:productID/ask', async (req, res) => {
  const askFiltersInput = checkAskFilters(req)
  const ask = await searchService.getAsk(askFiltersInput, req)
  res.json(ask)
})

export default router
