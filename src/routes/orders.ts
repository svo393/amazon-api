import Router from 'express'
// import orderProductsService from '../services/orderProductService'
import orderService from '../services/orderService'
import { checkOrderUpdate, checkNewOrder } from '../utils/inputValidator'
import { isCreator, isLoggedIn, isCreatorOrAdmin, isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const orderCreateInput = checkNewOrder(req)
  const addedOrder = await orderService.addOrder(orderCreateInput)
  res.status(201).json(addedOrder)
})

router.get('/', isAdmin, async (_req, res) => {
  const roles = await orderService.getOrders()
  res.json(roles)
})

router.get('/:orderID', isCreatorOrAdmin('orders', 'orderID', 'params'), async (req, res) => {
  const order = await orderService.getOrderByID(req)
  res.json(order)
})

router.put('/:orderID', isCreatorOrAdmin('orders', 'orderID', 'params'), async (req, res) => {
  const orderUpdateInput = checkOrderUpdate(req)
  const updatedItem = await orderService.updateOrder(orderUpdateInput, req)
  res.json(updatedItem)
})

// router.post('/:orderID/products/:productID', isCreator('orders', 'orderID', 'params'), async (req, res) => {
//   const addedOrderProduct = await orderProductsService.addOrderProduct(req)
//   res.status(201).json(addedOrderProduct)
// })

// router.delete('/:orderID/products/:productID', isCreator('orders', 'orderID', 'params'), async (req, res) => {
//   await orderProductsService.deleteOrderProduct(req)
//   res.status(204).end()
// })

export default router
