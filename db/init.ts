import { invoiceStatuses, lockerAddresses, orderStatuses, addressTypes, roles, shippingMethods } from '../src/utils/constants'
import { AddressType } from '../src/types'
import { db } from '../src/utils/db'

export const init = async (): Promise<void> => {
  await db('roles').del()
  await db('roles').insert(roles.map((r) => ({ name: r })))

  await db('shippingMethods').del()
  await db('shippingMethods').insert(shippingMethods.map((sm) => ({ name: sm })))

  await db('addressTypes').del()

  const ats: AddressType[] = await db('addressTypes')
    .insert(addressTypes.map((at) => ({ name: at })), [ '*' ])

  await db('addresses').del()

  await db('addresses').insert(lockerAddresses.map((a) => ({
    addr: a, addressTypeID: ats.find((at) => at.name === 'LOCKER')?.addressTypeID
  })))

  await db('orderStatuses').del()
  await db('orderStatuses').insert(orderStatuses.map((os) => ({ name: os })))

  await db('invoiceStatuses').del()
  await db('invoiceStatuses').insert(invoiceStatuses.map((os) => ({ name: os })))
}

const disconnect = async (): Promise<void> => {
  await db.destroy()
}

init().then(() => disconnect())
