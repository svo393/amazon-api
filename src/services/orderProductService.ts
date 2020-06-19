import { Request } from 'express'
import { OrderProduct, OrderProductCreateInput, OrderProductUpdateInput } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'
import Knex from 'knex'

const addOrderProduct = async (orderProductInput: OrderProductCreateInput, req: Request): Promise<OrderProduct> => {
  const { rows: [ addedOrderProduct ] }: { rows: OrderProduct[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('orderProducts').insert({
      ...orderProductInput,
      orderID: Number(req.params.orderID)
    }) ]
  )

  if (addedOrderProduct === undefined) {
    throw new StatusError(409, 'This product is already added to the order')
  }
  return addedOrderProduct
}

const updateOrderProduct = async (orderProductInput: OrderProductUpdateInput, req: Request): Promise<OrderProduct> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const [ updatedOrderProduct ]: OrderProduct[] = await trx('orderProducts')
      .update(orderProductInput, [ '*' ])
      .where('productID', req.params.productID)
      .andWhere('orderID', req.params.orderID)

    if (updatedOrderProduct === undefined) throw new StatusError(404, 'Not Found')

    await trx('orders')
      .update({ updatedAt: new Date() })
      .where('orderID', updatedOrderProduct.orderID)

    return updatedOrderProduct
  })
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
