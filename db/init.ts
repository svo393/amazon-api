import { addressTypes, invoiceStatuses, lockerAddresses, moderationStatuses, orderStatuses, paymentMethods, roles, shippingMethods } from '../src/utils/constants'
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
  await db('groupVariants').del()
  await db('images').del()
  await db('answerComments').del()
  await db('answers').del()
  await db('questions').del()
  await db('ratingComments').del()
  await db('ratings').del()
  await db('listProducts').del()
  await db('products').del()
  await db('groups').del()
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
  await db('moderationStatuses').del()
  await db('roles').del()

  await db.raw(
    `
    ALTER SEQUENCE "invoices_invoiceID_seq" START WITH 274 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "orders_orderID_seq" START WITH 512 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "images_imageID_seq" START WITH 1923 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "answerComments_answerCommentID_seq" START WITH 553 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "answers_answerID_seq" START WITH 480 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "questions_questionID_seq" START WITH 308 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "ratingComments_ratingCommentID_seq" START WITH 505 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "ratings_ratingID_seq" START WITH 761 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "products_productID_seq" START WITH 14397 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "vendors_vendorID_seq" START WITH 527 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "categories_categoryID_seq" START WITH 361 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "lists_listID_seq" START WITH 735 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "users_userID_seq" START WITH 3814 INCREMENT BY 3 RESTART;
    ALTER SEQUENCE "addresses_addressID_seq" START WITH 307 INCREMENT BY 3 RESTART;
    `
  )

  await db('roles').insert(roles.map((r) => ({ roleName: r })))

  await db('moderationStatuses').insert(moderationStatuses.map((ms) => ({ moderationStatusName: ms })))

  await db('shippingMethods').insert(shippingMethods)

  await db('paymentMethods').insert(paymentMethods.map((pt) => ({ paymentMethodName: pt })))

  await db('addressTypes').insert(addressTypes)

  await db('addresses').insert(lockerAddresses.map((a) => ({
    addr: a, addressType: 'LOCKER'
  })))

  await db('orderStatuses').insert(orderStatuses.map((os) => ({ orderStatusName: os })))

  await db('invoiceStatuses').insert(invoiceStatuses.map((os) => ({ invoiceStatusName: os })))
}

init().then(async () => db.destroy())
