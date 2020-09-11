import { Request } from 'express'
import { OrderProduct, OrderProductInput } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'
import Knex from 'knex'

const addOrderProduct = async (orderProductInput: OrderProductInput, req: Request): Promise<OrderProduct> => {
  const { rows: [ addedOrderProduct ] }: { rows: OrderProduct[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('orderProducts').insert({
      ...orderProductInput,
      orderID: req.params.orderID,
      productID: req.params.productID
    }) ]
  )

  if (addedOrderProduct === undefined) {
    throw new StatusError(409, 'This product is already added to the order')
  }
  return addedOrderProduct
}

const updateOrderProduct = async (orderProductInput: OrderProductInput, req: Request): Promise<OrderProduct> => {
  const { qty, size, price } = orderProductInput
  return await dbTrans(async (trx: Knex.Transaction) => {
    const [ updatedOrderProduct ]: OrderProduct[] = await trx('orderProducts')
      .update({ qty, price }, [ '*' ])
      .where('productID', req.params.productID)
      .andWhere('orderID', req.params.orderID)
      .andWhere('size', size)

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
