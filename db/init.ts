import { AddressType } from '../src/types'
import { addressTypes, invoiceStatuses, lockerAddresses, orderStatuses, paymentMethods, roles, shippingMethods } from '../src/utils/constants'
import { db } from '../src/utils/db'

export const init = async (): Promise<void> => {
  await db('invoices').del()
  await db('invoiceStatuses').del()
  await db('orderProducts').del()
  await db('orders').del()
  await db('orderStatuses').del()
  await db('cartProducts').del()
  await db('productParameters').del()
  await db('parameters').del()
  await db('groupProducts').del()
  await db('groups').del()
  await db('answerComments').del()
  await db('answers').del()
  await db('questions').del()
  await db('ratingComments').del()
  await db('ratings').del()
  await db('listProducts').del()
  await db('products').del()
  await db('vendors').del()
  await db('categories').del()
  await db('lists').del()
  await db('userAddresses').del()
  await db('followers').del()
  await db('users').del()
  await db('addresses').del()
  await db('paymentMethods').del()
  await db('addressTypes').del()
  await db('shippingMethods').del()
  await db('roles').del()

  await db.raw(
    `
    ALTER SEQUENCE "invoices_invoiceID_seq" START WITH 274 RESTART;
    ALTER SEQUENCE "orders_orderID_seq" START WITH 512 RESTART;
    ALTER SEQUENCE "answerComments_answerCommentID_seq" START WITH 553 RESTART;
    ALTER SEQUENCE "answers_answerID_seq" START WITH 480 RESTART;
    ALTER SEQUENCE "questions_questionID_seq" START WITH 308 RESTART;
    ALTER SEQUENCE "ratingComments_ratingCommentID_seq" START WITH 505 RESTART;
    ALTER SEQUENCE "ratings_ratingID_seq" START WITH 761 RESTART;
    ALTER SEQUENCE "products_productID_seq" START WITH 14397 RESTART;
    ALTER SEQUENCE "vendors_vendorID_seq" START WITH 527 RESTART;
    ALTER SEQUENCE "categories_categoryID_seq" START WITH 361 RESTART;
    ALTER SEQUENCE "lists_listID_seq" START WITH 735 RESTART;
    ALTER SEQUENCE "users_userID_seq" START WITH 3814 RESTART;
    ALTER SEQUENCE "addresses_addressID_seq" START WITH 307 RESTART;
    `
  )

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

init().then(async () => db.destroy())
