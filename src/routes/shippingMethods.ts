import Router from 'express'
import shippingMethodService from '../services/shippingMethodService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isAdmin(res)
  const shippingMethodCreateInput = inputValidator.checkNewShippingMethod(req.body)
  const addedShippingMethod = await shippingMethodService.addShippingMethod(shippingMethodCreateInput)
  res.status(201).json(addedShippingMethod)
})

router.get('/', async (_req, res) => {
  const shippingMethods = await shippingMethodService.getShippingMethods()
  res.json(shippingMethods)
})

router.get('/:shippingMethodID', async (req, res) => {
  const shippingMethod = await shippingMethodService.getShippingMethodByID(Number(req.params.shippingMethodID))
  res.json(shippingMethod)
})

router.put('/:shippingMethodID', async (req, res) => {
  shield.isAdmin(res)
  const shippingMethodUpdateInput = inputValidator.checkShippingMethodUpdate(req.body)
  const updatedItem = await shippingMethodService.updateShippingMethod(shippingMethodUpdateInput, Number(req.params.shippingMethodID))
  res.json(updatedItem)
})

export default router
