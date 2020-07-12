import Router from 'express'
import shippingMethodService from '../services/shippingMethodService'
import { checkShippingMethod } from '../utils/inputValidator'
import { requireAdmin } from '../utils/middleware'

const router = Router()

router.post('/', requireAdmin, async (req, res) => {
  const shippingMethodCreateInput = checkShippingMethod(req)
  const addedShippingMethod = await shippingMethodService.addShippingMethod(shippingMethodCreateInput)
  res.status(201).json(addedShippingMethod)
})

router.get('/', async (_, res) => {
  const shippingMethods = await shippingMethodService.getShippingMethods()
  res.json(shippingMethods)
})

router.get('/:shippingMethodName', async (req, res) => {
  const shippingMethod = await shippingMethodService.getShippingMethodByName(req)
  res.json(shippingMethod)
})

router.put('/:shippingMethodName', requireAdmin, async (req, res) => {
  const shippingMethodUpdateInput = checkShippingMethod(req)
  const updatedItem = await shippingMethodService.updateShippingMethod(shippingMethodUpdateInput, req)
  res.json(updatedItem)
})

router.delete('/:shippingMethodName', requireAdmin, async (req, res) => {
  await shippingMethodService.deleteShippingMethod(req)
  res.status(204).end()
})

export default router
