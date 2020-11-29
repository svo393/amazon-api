import Router from 'express'
import orderStatusService from '../services/orderStatusService'
import { checkOrderStatus } from '../utils/typeGuard'
import { requireAdmin } from '../utils/middleware'

const router = Router()

router.post('/', requireAdmin, async (req, res) => {
  const orderStatusCreateInput = checkOrderStatus(req)
  const addedOrderStatus = await orderStatusService.addOrderStatus(
    orderStatusCreateInput
  )
  res.status(201).json(addedOrderStatus)
})

router.get('/', requireAdmin, async (_, res) => {
  const orderStatuses = await orderStatusService.getOrderStatuses()
  res.json(orderStatuses)
})

router.put('/:orderStatusName', requireAdmin, async (req, res) => {
  const orderStatusUpdateInput = checkOrderStatus(req)
  const updatedOrderStatus = await orderStatusService.updateOrderStatus(
    orderStatusUpdateInput,
    req
  )
  res.json(updatedOrderStatus)
})

router.delete('/:orderStatusName', requireAdmin, async (req, res) => {
  await orderStatusService.deleteOrderStatus(req)
  res.status(204).end()
})

export default router
