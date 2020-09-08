import { Request } from 'express'
import Knex from 'knex'
import { omit, sum } from 'ramda'
import { Address, BatchWithCursor, Invoice, Order, OrderCreateInput, OrderFullData, OrderProduct, OrderProductFullData, OrdersFiltersInput, OrderUpdateInput, OrderWithUser } from '../types'
import { smallLimit } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addOrder = async (orderInput: OrderCreateInput, req: Request): Promise<OrderFullData & Invoice & { invoiceCreatedAt: Date; invoiceUpdatedAt: Date }> => {
  const { cart, addressID } = orderInput
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const userID = req.session?.userID

    const address = await trx<Address>('addresses')
      .first()
      .where('addressID', addressID)

    if (address === undefined) throw new StatusError()

    const [ addedOrder ]: Order[] = await trx('orders')
      .insert({
        ...omit([ 'cart', 'details', 'paymentMethod', 'shippingCost', 'addressID' ], orderInput),
        address,
        orderStatus: 'NEW',
        createdAt: now,
        updatedAt: now,
        userID
      }, [ '*' ])

    const cartProducts: {
      productID: number;
      price: number;
      qty: number;
    }[] = await trx('cartProducts as cp')
      .select('p.productID', 'p.price', 'cp.qty')
      .where('cp.userID', userID)
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

    await Promise.all(newOrderProducts.map(async (op) => {
      const product = await trx('products')
        .first('stock')
        .where('productID', op.productID)

      await trx('products')
        .where('productID', op.productID)
        .update({ stock: product.stock - op.qty })
    }))

    const [ addedInvoice ]: Invoice[] = await trx('invoices')
      .insert({
        amount: (sum(addedOrderProducts.map((op) => op.qty * op.price)) + orderInput.shippingCost * 100),
        shippingCost: orderInput.shippingCost * 100,
        details: orderInput.details,
        orderID: addedOrder.orderID,
        userID,
        paymentMethod: orderInput.paymentMethod,
        invoiceStatus: 'NEW',
        createdAt: now,
        updatedAt: now
      }, [ '*' ])

    const deleteCount = await db('cartProducts')
      .del()
      .where('userID', userID)

    if (deleteCount === 0) throw new StatusError()

    return {
      ...addedInvoice,
      ...addedOrder,
      invoiceCreatedAt: addedInvoice.createdAt,
      invoiceUpdatedAt: addedInvoice.updatedAt,
      amount: addedInvoice.amount / 100,
      shippingCost: addedInvoice.shippingCost / 100,
      orderProducts: addedOrderProducts
    }
  })
}

const getOrders = async (ordersFiltersinput: OrdersFiltersInput, req: Request): Promise<BatchWithCursor<OrderWithUser & Invoice & { invoiceCreatedAt: Date; invoiceUpdatedAt: Date }>> => {
  const {
    page = 1,
    sortBy = 'createdAt_desc',
    orderStatuses,
    shippingMethods,
    amountMin,
    amountMax,
    createdFrom,
    createdTo,
    userEmail,
    userID
  } = ordersFiltersinput

  if (![ 'ROOT', 'ADMIN' ].includes(req.session?.role)) {
    if (userID === undefined || req.session?.userID !== userID) {
      throw new StatusError(403, 'Forbidden')
    }
  }

  let orders: (Order & Invoice & { invoiceCreatedAt: Date; invoiceUpdatedAt: Date; avatar: boolean; userName: string; userEmail: string })[] = await db('orders as o')
    .select(
      'o.orderID',
      'o.address',
      'o.createdAt',
      'o.updatedAt',
      'i.createdAt as invoiceCreatedAt',
      'i.updatedAt as invoiceUpdatedAt',
      'o.userID',
      'o.orderStatus',
      'o.shippingMethod',
      'i.invoiceID',
      'i.amount',
      'i.shippingCost',
      'i.details',
      'i.invoiceStatus',
      'i.paymentMethod',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .join('invoices as i', 'o.orderID', 'i.orderID')
    .join('users as u', 'o.userID', 'u.userID')

  orders = orders.map((o) => ({
    ...o,
    amount: o.amount / 100,
    shippingCost: o.shippingCost / 100
  }))

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
      .filter((o) => o.amount >= amountMin)
  }

  if (amountMax !== undefined) {
    orders = orders
      .filter((o) => o.amount <= amountMax)
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

  if (userID !== undefined) {
    orders = orders
      .filter((o) => o.userID === userID)
  }

  const ordersSorted = sortItems(orders, sortBy)

  const totalCount = orders.length
  const end = (page - 1) * smallLimit + smallLimit

  const batch = ordersSorted.slice((page - 1) * smallLimit, end)

  const orderIDs = batch.map((o) => o.orderID)

  const orderProducts: OrderProductFullData[] = await db('orderProducts as op')
    .select(
      'op.price',
      'op.qty',
      'op.productID',
      'op.orderID',
      'p.title',
      'i.imageID'
    )
    .whereIn('orderID', orderIDs)
    .joinRaw('JOIN products as p USING ("productID")')
    .join('images as i', 'p.productID', 'i.productID')
    .where('i.index', 0)

  const _batch = batch.map((o) => ({
    ...(omit([ 'userName', 'userEmail', 'avatar' ], o)),
    orderProducts: orderProducts
      .filter((op) => op.orderID === o.orderID)
      .map((op) => ({
        ...op,
        price: op.price / 100
      })),
    user: {
      avatar: o.avatar,
      name: o.userName,
      email: o.userEmail,
      userID: o.userID
    }
  }))

  _batch.forEach((o) => {
    if (o.orderProducts.length === 0) { throw new StatusError() }
  })

  return {
    batch: _batch,
    totalCount: orders.length,
    hasNextPage: end < totalCount
  }
}

const getOrderByID = async (req: Request): Promise<OrderWithUser & Invoice & { invoiceCreatedAt: Date; invoiceUpdatedAt: Date }> => {
  const { orderID } = req.params

  const order: Order & { invoiceCreatedAt: Date; invoiceUpdatedAt: Date; avatar: boolean; userName: string; userEmail: string } = await db('orders as o')
    .first(
      'o.orderID',
      'o.address',
      'o.createdAt',
      'o.updatedAt',
      'i.createdAt as invoiceCreatedAt',
      'i.updatedAt as invoiceUpdatedAt',
      'o.userID',
      'o.orderStatus',
      'o.shippingMethod',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .joinRaw('JOIN users as u USING ("userID")')
    .joinRaw('JOIN invoices as i USING ("orderID")')
    .where('orderID', orderID)

  const invoice = await db<Invoice>('invoices')
    .first()
    .where('orderID', orderID)

  const orderProducts: OrderProductFullData[] = await db('orderProducts as op')
    .select(
      'op.price',
      'op.qty',
      'op.productID',
      'op.orderID',
      'p.title',
      'i.imageID'
    )
    .where('orderID', req.params.orderID)
    .joinRaw('JOIN products as p USING ("productID")')
    .join('images as i', 'p.productID', 'i.productID')
    .where('i.index', 0)

  if (order === undefined || invoice === undefined) throw new StatusError(404, 'Not Found')

  const _order: OrderWithUser & Invoice & { invoiceCreatedAt: Date; invoiceUpdatedAt: Date } = {
    ...invoice,
    ...(omit([ 'userName', 'userEmail', 'avatar' ], order)),
    amount: invoice.amount / 100,
    shippingCost: invoice.shippingCost / 100,
    orderProducts: orderProducts.map((op) => ({
      ...op,
      price: op.price / 100
    })),
    user: {
      avatar: order.avatar,
      name: order.userName,
      email: order.userEmail,
      userID: order.userID
    }
  }

  ![ 'ROOT', 'ADMIN' ].includes(req.session?.role) &&
  delete _order.user.email

  return _order
}

const updateOrder = async (orderInput: OrderUpdateInput, req: Request): Promise<Order> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const now = new Date()

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
        updatedAt: now,
        shippedAt: orderInput.orderStatus === 'SHIPPED' ? now : undefined
      }, [ '*' ])
      .where('orderID', req.params.orderID)

    if (updatedOrder === undefined) throw new StatusError(404, 'Not Found')
    return updatedOrder
  })
}

export default {
  addOrder,
  getOrders,
  getOrderByID,
  updateOrder
}
