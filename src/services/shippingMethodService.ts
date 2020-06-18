import { Request } from 'express'
import { ShippingMethod as SM, ShippingMethodInput as SMInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addShippingMethod = async (smInput: SMInput): Promise<SM> => {
  const { rows: [ addedSM ] }: { rows: SM[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('shippingMethods').insert(smInput) ]
  )

  if (typeof (addedSM) === 'undefined') {
    throw new StatusError(409, `ShippingMethod with name "${smInput.shippingMethodName}" already exists`)
  }
  return addedSM
}

const getShippingMethods = async (): Promise<SM[]> => {
  return await db('shippingMethods')
}

const getShippingMethodByName = async (req: Request): Promise<SM> => {
  const sm = await db<SM>('shippingMethods')
    .first()
    .where('shippingMethodName', req.params.shippingMethodName)

  if (typeof (sm) === 'undefined') throw new StatusError(404, 'Not Found')
  return sm
}

const updateShippingMethod = async (smInput: SMInput, req: Request): Promise<SM> => {
  const [ updatedSM ]: SM[] = await db('shippingMethods')
    .update(smInput, [ '*' ])
    .where('shippingMethodName', req.params.shippingMethodName)

  if (typeof (updatedSM) === 'undefined') throw new StatusError(404, 'Not Found')
  return updatedSM
}

const deleteShippingMethod = async (req: Request): Promise<void> => {
  const deleteCount = await db('shippingMethodes')
    .del()
    .where('shippingMethodName', req.params.shippingMethodName)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addShippingMethod,
  getShippingMethods,
  getShippingMethodByName,
  updateShippingMethod,
  deleteShippingMethod
}
