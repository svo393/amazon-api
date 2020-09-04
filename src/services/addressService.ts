import { Request } from 'express'
import Knex from 'knex'
import { omit } from 'ramda'
import { Address, AddressCreateInput, AddressUpdateInput, UserAddress } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addAddress = async (addressInput: AddressCreateInput, req: Request): Promise<Address & UserAddress> => {
  const userID: number = req.session?.userID

  const { isDefault } = addressInput

  return await dbTrans(async (trx: Knex.Transaction) => {
    const existingUserAddresses = await trx<Address & UserAddress>('addresses as a')
      .joinRaw('LEFT JOIN "userAddresses" as ua USING ("addressID")')
      .where('userID', userID)

    existingUserAddresses.length !== 0 && isDefault && await trx('userAddresses')
      .where('userID', userID)
      .andWhere('isDefault', true)
      .update({ isDefault: false }, [ '*' ])

    const [ addedAddress ]: Address[] = await trx('addresses')
      .insert(omit([ 'isDefault' ], addressInput), [ '*' ])

    const [ addedUserAddress ]: UserAddress[] = await trx('userAddresses')
      .insert({
        isDefault: isDefault ?? existingUserAddresses.length === 0,
        addressID: addedAddress.addressID,
        userID
      }, [ '*' ])

    return { ...addedAddress, ...addedUserAddress }
  })
}

const getAddressesByUser = async (req: Request): Promise<(Address & UserAddress)[]> => {
  return await db('userAddresses as ua')
    .where('userID', req.params.userID)
    .join('addresses as a', 'ua.addressID', 'a.addressID')
}

const getAddressesByType = async (req: Request): Promise<Address[]> => {
  return await db('addresses')
    .where('addressType', req.params.addressTypeName)
}

type AddressFullData = Address & { userID: string; isPrivate: boolean }

const getAddressByID = async (req: Request): Promise<AddressFullData> => {
  const address: AddressFullData = await db('addresses as a')
    .first(
      'a.addressID',
      'a.addr',
      'a.addressType',
      'ua.userID',
      'at.isPrivate'
    )
    .where('addressID', req.params.addressID)
    .joinRaw('JOIN "userAddresses" as ua USING ("addressID")')
    .leftJoin('addressTypes as at', 'a.addressType', 'at.addressTypeName')

  if (address === undefined) throw new StatusError(404, 'Not Found')

  const role: string | undefined = req.session?.role

  if (
    address.isPrivate &&
    (!role || ![ 'ROOT', 'ADMIN' ].includes(role)) &&
    address.userID !== req.session?.userID
  ) {
    throw new StatusError(404, 'Not Found')
  }
  return address
}

const updateAddress = async (addressInput: AddressUpdateInput, req: Request): Promise<Address> => {
  const [ updatedAddress ]: Address[] = await db('addresses')
    .update({
      ...addressInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('addressID', req.params.addressID)

  if (updatedAddress === undefined) throw new StatusError(404, 'Not Found')
  return updatedAddress
}

const deleteAddress = async (req: Request): Promise<Address> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const address = await trx<Address>('addresses')
      .first()
      .where('addressID', req.params.addressID)

    const deleteCount = await trx('addresses')
      .del()
      .where('addressID', req.params.addressID)

    if (deleteCount === 0 || address === undefined) throw new StatusError(404, 'Not Found')

    return address
  })
}

export default {
  addAddress,
  getAddressesByUser,
  getAddressesByType,
  getAddressByID,
  updateAddress,
  deleteAddress
}
