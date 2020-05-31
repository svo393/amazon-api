import { Request, Response } from 'express'
import { PaymentType, PaymentTypeInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addPaymentType = async (paymentTypeInput: PaymentTypeInput): Promise<PaymentType> => {
  const { rows: [ addedPT ] }: { rows: PaymentType[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('paymentTypes').insert(paymentTypeInput) ]
  )

  if (!addedPT) {
    throw new StatusError(409, `PaymentType with name "${paymentTypeInput.name}" already exists`)
  }
  return addedPT
}

const getPaymentTypes = async (): Promise<PaymentType[]> => {
  return await db<PaymentType>('paymentTypes')
}

const getPaymentTypeByID = async (req: Request): Promise<PaymentType> => {
  const paymentType = await db('paymentTypes')
    .first()
    .where('paymentTypeID', req.params.paymentTypeID)
  return paymentType
}

const updatePaymentType = async (paymentTypeInput: PaymentTypeInput, req: Request): Promise<PaymentType> => {
  const [ updatedPaymentType ]: PaymentType[] = await db('paymentTypes')
    .update(paymentTypeInput, [ '*' ])
    .where('paymentTypeID', req.params.paymentTypeID)

  if (!updatedPaymentType) throw new StatusError(404, 'Not Found')
  return updatedPaymentType
}

export default {
  addPaymentType,
  getPaymentTypes,
  getPaymentTypeByID,
  updatePaymentType
}
