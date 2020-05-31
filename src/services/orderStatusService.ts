import { Request } from 'express'
import { OrderStatus, OrderStatusInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addOrderStatus = async (orderStatusInput: OrderStatusInput): Promise<OrderStatus> => {
  const { rows: [ addedOrderStatus ] }: { rows: OrderStatus[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('orderStatuses').insert(orderStatusInput) ]
  )

  if (!addedOrderStatus) {
    throw new StatusError(409, `OrderStatus with name "${orderStatusInput.name}" already exists`)
  }
  return addedOrderStatus
}

const getOrderStatuses = async (): Promise<OrderStatus[]> => {
  return await db<OrderStatus>('orderStatuses')
}

const updateOrderStatus = async (orderStatusInput: OrderStatusInput, req: Request): Promise<OrderStatus> => {
  const [ updatedOrderStatus ]: OrderStatus[] = await db('orderStatuses')
    .update(orderStatusInput, [ '*' ])
    .where('orderStatusID', req.params.orderStatusID)

  if (!updatedOrderStatus) throw new StatusError(404, 'Not Found')
  return updatedOrderStatus
}

export default {
  addOrderStatus,
  getOrderStatuses,
  updateOrderStatus
}
