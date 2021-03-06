import { Request } from 'express'
import {
  Address,
  AddressType,
  AddressType as AT,
  AddressTypeInput as ATInput
} from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addAddressType = async (atInput: ATInput): Promise<AT> => {
  const {
    rows: [addedAT]
  }: { rows: AT[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [db('addressTypes').insert(atInput)]
  )

  if (addedAT === undefined) {
    throw new StatusError(
      409,
      `AddressType with name "${atInput.addressTypeName}" already exists`
    )
  }
  return addedAT
}

const getAddressTypes = async (): Promise<AT[]> => {
  return await db('addressTypes')
}

type SingleAddressTypeData = AddressType & {
  addresses: Address[]
}

const getAddressTypeByName = async (
  req: Request
): Promise<SingleAddressTypeData> => {
  const { addressTypeName } = req.params

  const ats = await db<AT>('addressTypes')

  const filteredATs = ['ROOT', 'ADMIN'].includes(req.session?.role)
    ? ats
    : ats.filter((at) => !at.isPrivate)

  const [at] = filteredATs.filter(
    (shm) => shm.addressTypeName === addressTypeName
  )
  if (at === undefined) throw new StatusError(404, 'Not Found')

  const addresses = await db<Address>('addresses').where(
    'addressType',
    addressTypeName
  )

  return { ...at, addresses }
}

const updateAddressType = async (
  atInput: ATInput,
  req: Request
): Promise<SingleAddressTypeData> => {
  const [updatedAT]: AT[] = await db('addressTypes')
    .update(atInput, ['*'])
    .where('addressTypeName', req.params.addressTypeName)

  if (updatedAT === undefined) throw new StatusError(404, 'Not Found')

  const addresses = await db<Address>('addresses').where(
    'addressType',
    updatedAT.addressTypeName
  )

  return { ...updatedAT, addresses }
}

const deleteAddressType = async (req: Request): Promise<void> => {
  const deleteCount = await db('addressTypes')
    .del()
    .where('addressTypeName', req.params.addressTypeName)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addAddressType,
  getAddressTypes,
  getAddressTypeByName,
  updateAddressType,
  deleteAddressType
}
