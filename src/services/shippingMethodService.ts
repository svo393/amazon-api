import { Response } from 'express'
import { Address, ShippingMethod as SM, ShippingMethodInput as SMInput } from '../types'
import { sensitiveShippingMethods as sensitiveSMs } from '../utils/constants'
import db from '../utils/db'
import shield from '../utils/shield'
import StatusError from '../utils/StatusError'

const addShippingMethod = async (smInput: SMInput): Promise<SM> => {
  const { name } = smInput

  const existingSM = await db<SM>('shippingMethods')
    .first('shippingMethodID')
    .where('name', name)

  if (existingSM) {
    throw new StatusError(409, `ShippingMethod with name "${name}" already exists`)
  }

  const [ addedSM ]: SM[] = await db<SM>('shippingMethods')
    .insert(smInput, [ '*' ])

  return addedSM
}

const getShippingMethods = async (res: Response): Promise<SM[]> => {
  const hasPermission = shield.hasRole([ 'ROOT', 'ADMIN' ], res)
  const sms = await db<SM>('shippingMethods')

  return hasPermission
    ? sms
    : sms.filter((sm) => !sensitiveSMs.includes(sm.name))
}

type SingleShippingMethodData = {
  name: string;
  addresses: Address[];
}

const getShippingMethodByID = async (res: Response, smID: number): Promise<SingleShippingMethodData> => {
  const hasPermission = shield.hasRole([ 'ROOT', 'ADMIN' ], res)
  const sms = await db<SM>('shippingMethods')

  const filteredSMs = hasPermission
    ? sms
    : sms.filter((sm) => !sensitiveSMs.includes(sm.name))

  const [ sm ] = filteredSMs.filter((shm) => shm.shippingMethodID === smID)
  if (!sm) throw new StatusError(404, 'Not Found')

  const addresses = await db<Address>('addresses')
    .where('shippingMethodID', smID)

  return { ...sm, addresses }
}

const updateShippingMethod = async (res: Response, smInput: SMInput, smID: number): Promise<SingleShippingMethodData> => {
  const [ updatedSM ] = await db<SM>('shippingMethods')
    .update({ ...smInput }, [ 'shippingMethodID' ])
    .where('shippingMethodID', smID)

  if (!updatedSM) throw new StatusError(404, 'Not Found')
  return getShippingMethodByID(res, updatedSM.shippingMethodID)
}

export default {
  addShippingMethod,
  getShippingMethods,
  getShippingMethodByID,
  updateShippingMethod
}
