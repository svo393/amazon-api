import Router from 'express'
import orderProductService from '../services/orderProductService'
import orderService from '../services/orderService'
import { checkNewOrder, checkNewOrderProduct, checkOrderFilters, checkOrderProductUpdate, checkOrderUpdate } from '../utils/inputValidator'
import { requireAdmin, requireCreatorOrAdmin, requireAuth } from '../utils/middleware'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const orderCreateInput = checkNewOrder(req)
  const addedOrder = await orderService.addOrder(orderCreateInput)
  res.status(201).json(addedOrder)
})

router.get('/', requireAdmin, async (req, res) => {
  const ordersFiltersinput = checkOrderFilters(req)
  const orders = await orderService.getOrders(ordersFiltersinput)
  res.json(orders)
})

router.get('/:orderID', requireCreatorOrAdmin('orders', 'orderID', 'params'), async (req, res) => {
  const order = await orderService.getOrderByID(req)
  res.json(order)
})

router.put('/:orderID', requireAdmin, async (req, res) => {
  const orderUpdateInput = checkOrderUpdate(req)
  const updatedItem = await orderService.updateOrder(orderUpdateInput, req)
  res.json(updatedItem)
})

router.post('/:orderID/products', requireAdmin, async (req, res) => {
  const orderProductCreateInput = checkNewOrderProduct(req)
  const addedOrderProduct = await orderProductService.addOrderProduct(orderProductCreateInput, req)
  res.status(201).json(addedOrderProduct)
})

router.put('/:orderID/products/:productID', requireAdmin, async (req, res) => {
  const orderProductUpdateInput = checkOrderProductUpdate(req)
  const updatedOrderProduct = await orderProductService.updateOrderProduct(orderProductUpdateInput, req)
  res.status(200).json(updatedOrderProduct)
})

router.delete('/:orderID/products/:productID', requireAdmin, async (req, res) => {
  await orderProductService.deleteOrderProduct(req)
  res.status(204).end()
})

export default router
