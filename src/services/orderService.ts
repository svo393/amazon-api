import { Request } from 'express'
import Knex from 'knex'
import { omit, sum } from 'ramda'
import { Address, BatchWithCursor, Invoice, Order, OrderCreateInput, OrderFullData, OrderProduct, OrderProductFullData, OrdersFiltersInput, OrderUpdateInput, OrderWithUser } from '../types'
import { defaultLimit, smallLimit } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addOrder = async (orderInput: OrderCreateInput, req: Request): Promise<OrderFullData & Invoice & { address: Address }> => {
  const { cart, addressID } = orderInput
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const userID = req.session?.userID

    const [ addedOrder ]: Order[] = await trx('orders')
      .insert({
        ...omit([ 'cart', 'details', 'paymentMethod' ], orderInput),
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

    const [ addedInvoice ]: Invoice[] = await trx('invoices')
      .insert({
        amount: sum(addedOrderProducts.map((op) => op.qty * op.price)) / 100,
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

    const address = await trx<Address>('addresses')
      .first()
      .where('addressID', addressID)

    return {
      ...addedInvoice,
      ...addedOrder,
      orderProducts: addedOrderProducts,
      address
    }
  })
}

const getOrders = async (ordersFiltersinput: OrdersFiltersInput, req: Request): Promise<BatchWithCursor<OrderWithUser & Invoice & { address: Address }>> => {
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

  let orders: (Order & Invoice & { avatar: boolean; userName: string; userEmail: string })[] = await db('orders as o')
    .select(
      'o.orderID',
      'o.addressID',
      'o.createdAt',
      'o.updatedAt',
      'o.userID',
      'o.orderStatus',
      'o.shippingMethod',
      'i.invoiceID',
      'i.amount',
      'i.details',
      'i.invoiceStatus',
      'i.paymentMethod',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .join('invoices as i', 'o.orderID', 'i.orderID')
    .join('users as u', 'o.userID', 'u.userID')

  orders = orders.map((o) => ({ ...o, amount: o.amount / 100 }))

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
  const addressIDs = batch.map((o) => o.addressID)

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

  const addresses = await db<Address>('addresses')
    .whereIn('addressID', addressIDs)

  const _batch = batch.map((o) => ({
    ...(omit([ 'userName', 'userEmail', 'avatar' ], o)),
    orderProducts: orderProducts
      .filter((op) => op.orderID === o.orderID)
      .map((op) => ({
        ...op,
        price: op.price / 100
      })),
    address: addresses.find((a) => a.addressID === o.addressID),
    user: {
      avatar: o.avatar,
      name: o.userName,
      email: o.userEmail,
      userID: o.userID
    }
  }))

  _batch.forEach((o) => {
    if (o.orderProducts.length === 0 || o.address === undefined) {
      throw new StatusError()
    }
  })

  return {
    batch: _batch.map((o) => ({ ...o, address: o.address as Address })),
    totalCount: orders.length,
    hasNextPage: end < totalCount
  }
}

const getOrderByID = async (req: Request): Promise<OrderWithUser & Invoice & { address: Address }> => {
  const { orderID } = req.params

  const order: Order & { avatar: boolean; userName: string; userEmail: string } = await db('orders as o')
    .first(
      'o.orderID',
      'o.addressID',
      'o.createdAt',
      'o.updatedAt',
      'o.userID',
      'o.orderStatus',
      'o.shippingMethod',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .joinRaw('JOIN users as u USING ("userID")')
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

  const address = await db<Address>('addresses')
    .first()
    .where('addressID', order.addressID)

  if (address === undefined) throw new StatusError()

  const _order: OrderWithUser & Invoice & { address: Address } = {
    ...invoice,
    ...(omit([ 'userName', 'userEmail', 'avatar' ], order)),
    amount: invoice.amount / 100,
    orderProducts: orderProducts.map((op) => ({
      ...op,
      price: op.price / 100
    })),
    address,
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
