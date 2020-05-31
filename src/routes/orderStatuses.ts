import Router from 'express'
import orderStatusService from '../services/orderStatusService'
import { checkNewOrderStatus, checkOrderStatusUpdate } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const orderStatusCreateInput = checkNewOrderStatus(req)
  const addedOrderStatus = await orderStatusService.addOrderStatus(orderStatusCreateInput)
  res.status(201).json(addedOrderStatus)
})

router.get('/', isAdmin, async (_req, res) => {
  const orderStatuses = await orderStatusService.getOrderStatuses()
  res.json(orderStatuses)
})

router.put('/:orderStatusID', isAdmin, async (req, res) => {
  const orderStatusUpdateInput = checkOrderStatusUpdate(req)
  const updatedOrderStatus = await orderStatusService.updateOrderStatus(orderStatusUpdateInput, req)
  res.json(updatedOrderStatus)
})

export default router