import { Request } from 'express'
import Knex from 'knex'
import { omit } from 'ramda'
import { Address, AddressCreateInput, UserAddress } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addAddress = async (addressInput: AddressCreateInput, req: Request): Promise<Address & UserAddress> => {
  // TODO if new address isDefault, set false to the previous
  // TODO transfer all sequence db calls to transactions

  const { isDefault, addr, addressType } = addressInput

  const existingAddresses = await db<Address & UserAddress>('addresses as a')
    .joinRaw('LEFT JOIN "userAddresses" as ua USING ("addressID")')
    .where('addr', addr)
    .andWhere('addressType', addressType)

  let curUA // aka currentUserAddress

  if (existingAddresses.length !== 0) {
    curUA = existingAddresses.find((a) => a.userID === req.session?.userID)

    if (curUA !== undefined) {
      if (
        isDefault !== undefined &&
        curUA.isDefault !== isDefault
      ) {
        const [ updatedUserAddress ]: UserAddress[] = await db('userAddresses')
          .where('userID', curUA.userID)
          .andWhere('addressID', curUA.addressID)
          .update({ isDefault }, [ '*' ])

        curUA = { ...curUA, ...updatedUserAddress }
      }
    } else {
      const [ addedUserAddress ]: UserAddress[] = await db('userAddresses')
        .insert({
          isDefault,
          addressID: existingAddresses[0].addressID,
          userID: req.session?.userID
        }, [ '*' ])

      curUA = {
        addr,
        addressType,
        ...addedUserAddress
      }
    }
  } else {
    curUA = await dbTrans(async (trx: Knex.Transaction) => {
      const [ addedAddress ]: Address[] = await trx
        .insert(omit([ 'isDefault' ], addressInput), [ '*' ])
        .into('addresses')

      if (addedAddress === undefined) throw new StatusError()

      const [ addedUserAddress ]: UserAddress[] = await trx
        .insert({
          userID: req.session?.userID,
          addressID: addedAddress.addressID,
          isDefault
        }, [ '*' ])
        .into('userAddresses')
      return { ...addedAddress, ...addedUserAddress }
    })
  }
  return curUA
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

export default {
  addAddress,
  getAddressesByUser,
  getAddressesByType,
  getAddressByID
}
