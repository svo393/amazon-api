import Router from 'express'
import relService from '../services/relService'

const router = Router()

router.get('/:productID/similar', async (req, res) => {
  const product = await relService.getSimilar(req)
  res.json(product)
})

router.get('/:productID/with', async (req, res) => {
  const products = await relService.getWith(req)
  res.json(products)
})

// router.get('/:productID/sponsored', async (req, res) => {
//   const products = await relService.getSponsored(req)
//   res.json(products)
// })

// router.get('/:productID/after', async (req, res) => {
//   const products = await relService.getAfter(req)
//   res.json(products)
// })

// router.get('/:productID/compare', async (req, res) => {
//   const products = await relService.getCompare(req)
//   res.json(products)
// })

export default router
