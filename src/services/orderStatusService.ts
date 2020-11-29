import { Request } from 'express'
import { OrderStatus } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addOrderStatus = async (
  orderStatusInput: OrderStatus
): Promise<OrderStatus> => {
  const {
    rows: [addedOrderStatus]
  }: { rows: OrderStatus[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [db('orderStatuses').insert(orderStatusInput)]
  )

  if (addedOrderStatus === undefined) {
    throw new StatusError(
      409,
      `OrderStatus with name "${orderStatusInput.orderStatusName}" already exists`
    )
  }
  return addedOrderStatus
}

const getOrderStatuses = async (): Promise<OrderStatus[]> => {
  return await db('orderStatuses')
}

const updateOrderStatus = async (
  orderStatusInput: OrderStatus,
  req: Request
): Promise<OrderStatus> => {
  const [updatedOrderStatus]: OrderStatus[] = await db(
    'orderStatuses'
  )
    .update(orderStatusInput, ['*'])
    .where('orderStatusName', req.params.orderStatusName)

  if (updatedOrderStatus === undefined)
    throw new StatusError(404, 'Not Found')
  return updatedOrderStatus
}

const deleteOrderStatus = async (req: Request): Promise<void> => {
  const deleteCount = await db('orderStatuses')
    .del()
    .where('orderStatusName', req.params.orderStatusName)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addOrderStatus,
  getOrderStatuses,
  updateOrderStatus,
  deleteOrderStatus
}
