import { Request } from 'express'
import { PaymentMethod } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addPaymentMethod = async (
  paymentMethodInput: PaymentMethod
): Promise<PaymentMethod> => {
  const {
    rows: [addedPaymentMethod]
  }: { rows: PaymentMethod[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [db('paymentMethods').insert(paymentMethodInput)]
  )

  if (addedPaymentMethod === undefined) {
    throw new StatusError(
      409,
      `PaymentMethod with name "${paymentMethodInput.paymentMethodName}" already exists`
    )
  }
  return addedPaymentMethod
}

const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  return await db('paymentMethods')
}

const getPaymentMethodByName = async (
  req: Request
): Promise<PaymentMethod> => {
  return await db('paymentMethods')
    .first()
    .where('paymentMethodName', req.params.paymentMethodName)
}

const updatePaymentMethod = async (
  paymentMethodInput: PaymentMethod,
  req: Request
): Promise<PaymentMethod> => {
  const [updatedPaymentMethod]: PaymentMethod[] = await db(
    'paymentMethods'
  )
    .update(paymentMethodInput, ['*'])
    .where('paymentMethodName', req.params.paymentMethodName)

  if (updatedPaymentMethod === undefined)
    throw new StatusError(404, 'Not Found')
  return updatedPaymentMethod
}

const deletePaymentMethod = async (req: Request): Promise<void> => {
  const deleteCount = await db('paymentMethodes')
    .del()
    .where('paymentMethodName', req.params.paymentMethodName)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addPaymentMethod,
  getPaymentMethods,
  getPaymentMethodByName,
  updatePaymentMethod,
  deletePaymentMethod
}
