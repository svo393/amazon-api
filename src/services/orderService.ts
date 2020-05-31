import { Request, Response } from 'express'
import { Order, OrderCreateInput, OrderStatus } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addOrder = async (orderInput: OrderCreateInput, req: Request): Promise<Order> => {
  const now = new Date()

  const orderStatusID = await db<OrderStatus>('orderStatuses')
    .first()
    .where('name', 'NEW')

  const [ addedOrder ]: Order[] = await db('orders')
    .insert({
      ...orderInput,
      orderStatusID: orderStatusID?.orderStatusID,
      orderCreatedAt: now,
      orderUpdatedAt: now
    }, [ '*' ])

  return addedOrder
}

const getOrders = async (): Promise<Order[]> => {
  return await db('orders')
}

const getOrdersByUser = async (req: Request): Promise<Order[]> => {
  return await db('orders')
    .where('userID', req.params.userID)
}

const getOrderByID = async (req: Request): Promise<Order> => {
  const order = await db<Order>('orders')
    .first()
    .where('orderID', req.params.orderID)

  if (!order) throw new StatusError(404, 'Not Found')
  return order
}

const updateOrder = async (orderInput: OrderCreateInput, req: Request): Promise<Order> => {
  const [ updatedOrder ]: Order[] = await db<Order>('orders')
    .update({
      ...orderInput,
      orderUpdatedAt: new Date()
    }, [ '*' ])
    .where('orderID', req.params.orderID)

  if (!updatedOrder) throw new StatusError(404, 'Not Found')
  return updatedOrder
}

export default {
  addOrder,
  getOrders,
  getOrdersByUser,
  getOrderByID,
  updateOrder
}
