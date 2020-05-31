import { Request } from 'express'
import { PaymentMethod, PaymentMethodInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addPaymentMethod = async (paymentMethodInput: PaymentMethodInput): Promise<PaymentMethod> => {
  const { rows: [ addedPT ] }: { rows: PaymentMethod[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('paymentMethods').insert(paymentMethodInput) ]
  )

  if (!addedPT) {
    throw new StatusError(409, `PaymentMethod with name "${paymentMethodInput.name}" already exists`)
  }
  return addedPT
}

const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  return await db<PaymentMethod>('paymentMethods')
}

const getPaymentMethodByID = async (req: Request): Promise<PaymentMethod> => {
  const paymentMethod = await db('paymentMethods')
    .first()
    .where('paymentMethodID', req.params.paymentMethodID)
  return paymentMethod
}

const updatePaymentMethod = async (paymentMethodInput: PaymentMethodInput, req: Request): Promise<PaymentMethod> => {
  const [ updatedPaymentMethod ]: PaymentMethod[] = await db('paymentMethods')
    .update(paymentMethodInput, [ '*' ])
    .where('paymentMethodID', req.params.paymentMethodID)

  if (!updatedPaymentMethod) throw new StatusError(404, 'Not Found')
  return updatedPaymentMethod
}

export default {
  addPaymentMethod,
  getPaymentMethods,
  getPaymentMethodByID,
  updatePaymentMethod
}
