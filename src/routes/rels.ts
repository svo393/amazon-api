import Router from 'express'
import relService from '../services/relService'

const router = Router()

router.get('/:productID/similar', async (req, res) => {
  const product = await relService.getSimilar(req)
  res.json(product)
})

router.get('/:productID/explore', async (req, res) => {
  const products = await relService.getMoreToExplore(req)
  res.json(products)
})

router.get('/:productID/after', async (req, res) => {
  const products = await relService.getAfter(req)
  res.json(products)
})

router.get('/:productID/compare', async (req, res) => {
  const products = await relService.getCompare(req)
  res.json(products)
})

export default router
