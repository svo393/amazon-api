import { AddressType } from '../src/types'
import { addressTypes, invoiceStatuses, lockerAddresses, orderStatuses, paymentMethods, roles, shippingMethods } from '../src/utils/constants'
import { db } from '../src/utils/db'

export const init = async (): Promise<void> => {
  await db('invoiceStatuses').del()
  await db('orderStatuses').del()
  await db('addresses').del()
  await db('paymentMethods').del()
  await db('addressTypes').del()
  await db('shippingMethods').del()
  await db('roles').del()

  await db('roles').insert(roles.map((r) => ({ name: r })))

  await db('shippingMethods').insert(shippingMethods.map((sm) => ({ name: sm })))

  const ats: AddressType[] = await db('addressTypes')
    .insert(addressTypes.map((at) => ({ name: at })), [ '*' ])

  await db('paymentMethods').insert(paymentMethods.map((pt) => ({ name: pt })))

  await db('addresses').insert(lockerAddresses.map((a) => ({
    addr: a, addressTypeID: ats.find((at) => at.name === 'LOCKER')?.addressTypeID
  })))

  await db('orderStatuses').insert(orderStatuses.map((os) => ({ name: os })))

  await db('invoiceStatuses').insert(invoiceStatuses.map((os) => ({ name: os })))
}
