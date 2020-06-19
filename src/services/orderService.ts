import { Request } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { Invoice, Order, OrderCreateInput, OrderFiltersInput, OrderFullData, OrderProduct, OrderProductFullData, OrderUpdateInput } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addOrder = async (orderInput: OrderCreateInput): Promise<OrderFullData & Invoice> => {
  const { cart } = orderInput
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const [ addedOrder ]: Order[] = await trx('orders')
      .insert({
        ...R.omit([ 'cart', 'details', 'paymentMethod' ], orderInput),
        orderStatus: 'NEW',
        createdAt: now,
        updatedAt: now
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

    const [ addedInvoice ]: Invoice[] = await trx('invoices')
      .insert({
        amount: R.sum(addedOrderProducts.map((op) => op.qty * op.price)),
        details: orderInput.details,
        orderID: addedOrder.orderID,
        userID: orderInput.userID,
        paymentMethod: orderInput.paymentMethod,
        invoiceStatus: 'NEW',
        createdAt: now,
        updatedAt: now
      }, [ '*' ])

    return {
      ...addedOrder,
      ...addedInvoice,
      orderProducts: addedOrderProducts
    }
  })
}

const getOrders = async (orderFilterInput: OrderFiltersInput): Promise<Order[]> => {
  const {
    orderStatuses,
    shippingMethods,
    amountMin,
    amountMax,
    createdFrom,
    createdTo,
    userEmail
  } = orderFilterInput

  let orders: Order[] = await db('orders as o')
    .select(
      'o.orderID',
      'o.address',
      'u.email as userEmail',
      'o.createdAt',
      'o.updatedAt',
      'o.userID',
      'o.orderStatus',
      'o.shippingMethod',
      'i.amount',
      'i.invoiceID'
    )
    .join('invoices as i', 'o.orderID', 'i.orderID')
    .join('users as u', 'o.userID', 'u.userID')
    .groupBy('o.orderID', 'i.amount', 'i.invoiceID', 'userEmail')

  if (orderStatuses !== undefined) {
    orders = orders
      .filter((o) => orderStatuses.split(',').includes(o.orderStatus))
  }

  if (shippingMethods !== undefined) {
    orders = orders
      .filter((o) => shippingMethods.split(',').includes(o.shippingMethod))
  }

  if (amountMin !== undefined) {
    orders = orders
      .filter((o) => o.amount >= amountMin * 100)
  }

  if (amountMax !== undefined) {
    orders = orders
      .filter((o) => o.amount <= amountMax * 100)
  }

  if (createdFrom !== undefined) {
    orders = orders
      .filter((o) => o.createdAt >= new Date(createdFrom))
  }

  if (createdTo !== undefined) {
    orders = orders
      .filter((o) => o.createdAt <= new Date(createdTo))
  }

  if (userEmail !== undefined) {
    orders = orders
      .filter((o) => o.userEmail?.toLowerCase().includes(userEmail.toLowerCase()))
  }

  return orders
}

const getOrdersByUser = async (req: Request): Promise<Order[]> => {
  return await db<Order>('orders as o')
    .select(
      'o.orderID',
      'o.address',
      'u.email as userEmail',
      'o.createdAt',
      'o.updatedAt',
      'o.userID',
      'o.orderStatus',
      'o.shippingMethod',
      'i.amount',
      'i.invoiceID'
    )
    .join('invoices as i', 'o.orderID', 'i.orderID')
    .join('users as u', 'o.userID', 'u.userID')
    .where('o.userID', req.params.userID)
}

const getOrderByID = async (req: Request): Promise<OrderFullData> => {
  const order: Order = await db('orders as o')
    .first(
      'o.orderID',
      'o.address',
      'u.email as userEmail',
      'o.createdAt',
      'o.updatedAt',
      'o.userID',
      'o.orderStatus',
      'o.shippingMethod',
      'i.amount',
      'i.invoiceID'
    )
    .joinRaw('JOIN users as u USING ("userID")')
    .joinRaw('JOIN invoices as i USING ("orderID")')
    .where('orderID', req.params.orderID)

  const orderProducts: OrderProductFullData[] = await db('orderProducts as op')
    .select(
      'op.price',
      'op.qty',
      'op.productID',
      'op.orderID',
      'p.title',
      'p.primaryMedia'
    )
    .where('orderID', req.params.orderID)
    .joinRaw('JOIN products as p USING ("productID")')

  if (order === undefined) throw new StatusError(404, 'Not Found')
  return {
    ...order,
    orderProducts
  }
}

const updateOrder = async (orderInput: OrderUpdateInput, req: Request): Promise<Order> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const order: { orderStatusName: string } = await trx('orders as o')
      .first('os.orderStatusName')
      .where('orderID', req.params.orderID)
      .join('orderStatuses as os', 'o.orderStatus', 'os.orderStatusName')

    if ([ 'DONE', 'CANCELED' ].includes(order.orderStatusName)) {
      throw new StatusError(410, 'This order can\'t be updated anymore')
    }

    const [ updatedOrder ]: Order[] = await trx('orders')
      .update({
        ...orderInput,
        updatedAt: new Date()
      }, [ '*' ])
      .where('orderID', req.params.orderID)

    if (updatedOrder === undefined) throw new StatusError(404, 'Not Found')
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
