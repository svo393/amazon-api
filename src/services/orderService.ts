import { Request } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { Order, OrderCreateInput, OrderProduct, OrderStatus, OrderUpdateInput, Invoice, InvoiceStatus } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addOrder = async (orderInput: OrderCreateInput): Promise<Order & Invoice> => {
  const { cart } = orderInput
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const orderStatusID = await trx<OrderStatus>('orderStatuses')
      .first()
      .where('name', 'NEW')

    const [ addedOrder ]: Order[] = await trx('orders')
      .insert({
        ...R.omit([ 'cart', 'details', 'paymentMethodID' ], orderInput),
        orderStatusID: orderStatusID?.orderStatusID,
        orderCreatedAt: now,
        orderUpdatedAt: now
      }, [ '*' ])

    const cartProducts: {
      productID: number;
      price: number;
      qty: number;
    }[] = await trx('cartProducts as cp')
      .select('p.productID', 'p.price', 'cp.qty')
      .where('cp.userID', 'in', cart.map((cp) => cp.userID))
      .andWhere('cp.productID', 'in', cart.map((cp) => cp.productID))
      .joinRaw('JOIN products as p USING ("productID")')

    const newOrderProducts = cartProducts.map((cp) => ({
      orderID: addedOrder.orderID,
      productID: cp.productID,
      price: cp.price,
      qty: cp.qty
    }))

    const addedOrderProducts: OrderProduct[] = await trx('orderProducts')
      .insert(newOrderProducts, [ '*' ])

    const invoiceStatusID = await trx<InvoiceStatus>('invoiceStatuses')
      .first()
      .where('name', 'NEW')

    const [ addedInvoice ]: Invoice[] = await trx('invoices')
      .insert({
        amount: R.sum(addedOrderProducts.map((op) => op.qty * op.price)),
        details: orderInput.details,
        orderID: addedOrder.orderID,
        userID: orderInput.userID,
        paymentMethodID: orderInput.paymentMethodID,
        invoiceStatusID: invoiceStatusID?.invoiceStatusID,
        invoiceCreatedAt: now,
        invoiceUpdatedAt: now
      }, [ '*' ])

    return {
      ...addedOrder,
      ...addedInvoice,
      orderProducts: addedOrderProducts
    }
  })
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

const updateOrder = async (orderInput: OrderUpdateInput, req: Request): Promise<Order> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const order: { orderStatusName: string } = await trx('orders')
      .first('os.name as orderStatusName')
      .where('orderID', req.params.orderID)
      .joinRaw('JOIN "orderStatuses" as os USING ("orderStatusID")')

    if ([ 'DONE', 'CANCELED' ].includes(order.orderStatusName)) {
      throw new StatusError(410, 'This order can\'t be updated anymore')
    }

    const [ updatedOrder ]: Order[] = await trx('orders')
      .update({
        ...orderInput,
        orderUpdatedAt: new Date()
      }, [ '*' ])
      .where('orderID', req.params.orderID)

    if (!updatedOrder) throw new StatusError(404, 'Not Found')
    return updatedOrder
  })
}

export default {
  addOrder,
  getOrders,
  getOrdersByUser,
  getOrderByID,
  updateOrder
}
