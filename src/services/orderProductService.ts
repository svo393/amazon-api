import { Request } from 'express'
import { OrderProduct } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addOrderProduct = async (req: Request): Promise<OrderProduct> => {
  const { rows: [ addedUA ] }: { rows: OrderProduct[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('orderProducts').insert({
      orderID: Number(req.params.orderID),
      productID: Number(req.params.productID)
    }) ]
  )

  if (!addedUA) {
    throw new StatusError(409, 'This product already added to the order')
  }
  return addedUA
}

const updateOrderProduct = async (orderProductInput: OrderProductUpdateInput, req: Request): Promise<OrderProduct> => {
  const [ updatedOrderProduct ]: OrderProduct[] = await db('orderProducts')
    .update({
      ...orderProductInput,
      orderProductUpdatedAt: new Date()
    }, [ '*' ])
    .where('orderProductID', req.params.orderProductID)

  if (!updatedOrderProduct) throw new StatusError(404, 'Not Found')
  return updatedOrderProduct
}

const deleteOrderProduct = async (req: Request): Promise<void> => {
  const deleteCount = await db('orderProducts')
    .del()
    .where('productID', req.params.productID)
    .andWhere('orderID', req.params.orderID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addOrderProduct,
  updateOrderProduct,
  deleteOrderProduct
}
