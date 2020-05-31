import { Request, Response } from 'express'
import { Address, AddressType as AT, AddressTypeInput as ATInput } from '../types'
import { sensitiveAddressTypes as sensitiveATs } from '../utils/constants'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addAddressType = async (atInput: ATInput): Promise<AT> => {
  const { rows: [ addedAT ] }: { rows: AT[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('addressTypes').insert(atInput) ]
  )

  if (!addedAT) {
    throw new StatusError(409, `AddressType with name "${atInput.name}" already exists`)
  }
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
  const addressTypeID = Number(req.params.addressTypeID)

  const ats = await db<AT>('addressTypes')

  const filteredATs = [ 'ROOT', 'ADMIN' ].includes(res.locals.userRole)
    ? ats
    : ats.filter((at) => !sensitiveATs.includes(at.name))

  const [ at ] = filteredATs.filter((shm) => shm.addressTypeID === Number(addressTypeID))
  if (!at) throw new StatusError(404, 'Not Found')

  const addresses = await db<Address>('addresses')
    .where('addressTypeID', addressTypeID)

  return { ...at, addresses }
}

const updateAddressType = async (res: Response, atInput: ATInput, req: Request): Promise<SingleAddressTypeData> => {
  const [ updatedAT ] = await db<AT>('addressTypes')
    .update(atInput, [ 'addressTypeID' ])
    .where('addressTypeID', req.params.addressTypeID)

  if (!updatedAT) throw new StatusError(404, 'Not Found')
  return getAddressTypeByID(res, req)
}

export default {
  addAddressType,
  getAddressTypes,
  getAddressTypeByID,
  updateAddressType
}
