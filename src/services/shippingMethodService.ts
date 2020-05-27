import { ShippingMethod as SM, ShippingMethodInput as SMInput } from '../types'
import { db } from '../utils/db'
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

const getShippingMethods = async (): Promise<SM[]> => {
  return await db<SM>('shippingMethods')
}

const getShippingMethodByID = async (smID: number): Promise<SM> => {
  const sm = await db<SM>('shippingMethods')
    .first()
    .where('shippingMethodID', smID)

  if (!sm) throw new StatusError(404, 'Not Found')
  return sm
}

const updateShippingMethod = async (smInput: SMInput, smID: number): Promise<SM> => {
  const [ updatedSM ] = await db<SM>('shippingMethods')
    .update({ ...smInput }, [ 'shippingMethodID', 'name' ])
    .where('shippingMethodID', smID)

  if (!updatedSM) throw new StatusError(404, 'Not Found')
  return updatedSM
}

export default {
  addShippingMethod,
  getShippingMethods,
  getShippingMethodByID,
  updateShippingMethod
}