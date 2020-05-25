import { invoiceStatuses, orderStatuses, roles, shippingMethods } from '../src/utils/constants'
import { db } from '../src/utils/db'

export const init = async (): Promise<void> => {
  await db('roles').del()

  await db('roles')
    .insert(roles.map((r) => ({ name: r })))

  await db('shippingMethods').del()

  await db('shippingMethods')
    .insert(shippingMethods.map((m) => ({ name: m })))

  await db('orderStatuses').del()

  await db('orderStatuses')
    .insert(orderStatuses.map((s) => ({ name: s })))

  await db('invoiceStatuses').del()

  await db('invoiceStatuses')
    .insert(invoiceStatuses.map((s) => ({ name: s })))
}

const disconnect = async (): Promise<void> => {
  await db.destroy()
}

init().then(() => disconnect())
