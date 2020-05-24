import { Response } from 'express'
import { Address, ShippingMethod, ShippingMethodInput } from '../types'
import { sensitiveShippingMethods } from '../utils/constants'
import db from '../utils/db'
import shield from '../utils/shield'
import StatusError from '../utils/StatusError'

const addShippingMethod = async (shippingMethodInput: ShippingMethodInput): Promise<ShippingMethod> => {
  const { name } = shippingMethodInput

  const existingShippingMethod = await db<ShippingMethod>('shippingMethods')
    .first('shippingMethodID')
    .where('name', name)

  if (existingShippingMethod) {
    throw new StatusError(409, `ShippingMethod with name "${name}" already exists`)
  }

  const [ addedShippingMethod ]: ShippingMethod[] = await db<ShippingMethod>('shippingMethods')
    .insert(shippingMethodInput, [ '*' ])

  return addedShippingMethod
}

const getShippingMethods = async (res: Response): Promise<ShippingMethod[]> => {
  const userHasPermission = shield.hasRole([ 'ROOT', 'ADMIN' ], res)
  const shippingMethods = await db<ShippingMethod>('shippingMethods')

  return userHasPermission
    ? shippingMethods
    : shippingMethods.filter((sm) => !sensitiveShippingMethods.includes(sm.name))
}

type SingleShippingMethodData = {
  name: string;
  addresses: Address[];
}

const getShippingMethodByID = async (res: Response, shippingMethodID: number): Promise<SingleShippingMethodData> => {
  const userHasPermission = shield.hasRole([ 'ROOT', 'ADMIN' ], res)
  const shippingMethods = await db<ShippingMethod>('shippingMethods')

  const filteredShippindMethods = userHasPermission
    ? shippingMethods
    : shippingMethods.filter((sm) => !sensitiveShippingMethods.includes(sm.name))

  const [ shippingMethod ] = filteredShippindMethods.filter((shm) => shm.shippingMethodID === shippingMethodID)
  if (!shippingMethod) throw new StatusError(404, 'Not Found')

  const addresses = await db<Address>('addresses')
    .where('shippingMethodID', shippingMethodID)

  return { ...shippingMethod, addresses }
}

const updateShippingMethod = async (res: Response, shippingMethodInput: ShippingMethodInput, shippingMethodID: number): Promise<SingleShippingMethodData> => {
  const [ updatedShippingMethod ] = await db<ShippingMethod>('shippingMethods')
    .update({ ...shippingMethodInput }, [ 'shippingMethodID' ])
    .where('shippingMethodID', shippingMethodID)

  if (!updatedShippingMethod) throw new StatusError(404, 'Not Found')
  return getShippingMethodByID(res, updatedShippingMethod.shippingMethodID)
}

export default {
  addShippingMethod,
  getShippingMethods,
  getShippingMethodByID,
  updateShippingMethod
}
