import { Request, Response } from 'express'
import { Address, AddressType as AT, AddressTypeInput as ATInput } from '../types'
import { sensitiveAddressTypes as sensitiveATs } from '../utils/constants'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addAddressType = async (atInput: ATInput): Promise<AT> => {
  const { name } = atInput

  const existingAT = await db<AT>('addressTypes')
    .first('addressTypeID')
    .where('name', name)

  if (existingAT) {
    throw new StatusError(409, `AddressType with name "${name}" already exists`)
  }

  const [ addedAT ]: AT[] = await db<AT>('addressTypes')
    .insert(atInput, [ '*' ])

  return addedAT
}

const getAddressTypes = async (): Promise<AT[]> => {
  return await db<AT>('addressTypes')
}

type SingleAddressTypeData = {
  name: string;
  addresses: Address[];
}

const getAddressTypeByID = async (res: Response, req: Request): Promise<SingleAddressTypeData> => {
  const { addressTypeID: atID } = req.params

  const hasPermission = [ 'ROOT', 'ADMIN' ].includes(res.locals.userRole)
  const ats = await db<AT>('addressTypes')

  const filteredATs = hasPermission
    ? ats
    : ats.filter((at) => !sensitiveATs.includes(at.name))

  const [ at ] = filteredATs.filter((shm) => shm.addressTypeID === Number(atID))
  if (!at) throw new StatusError(404, 'Not Found')

  const addresses = await db<Address>('addresses')
    .where('addressTypeID', atID)

  return { ...at, addresses }
}

const updateAddressType = async (res: Response, atInput: ATInput, req: Request): Promise<SingleAddressTypeData> => {
  const { addressTypeID: atID } = req.params

  const [ updatedAT ] = await db<AT>('addressTypes')
    .update({ ...atInput }, [ 'addressTypeID' ])
    .where('addressTypeID', atID)

  if (!updatedAT) throw new StatusError(404, 'Not Found')
  return getAddressTypeByID(res, req)
}

export default {
  addAddressType,
  getAddressTypes,
  getAddressTypeByID,
  updateAddressType
}
