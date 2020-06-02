import { Request, Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { Address, AddressCreateInput, UserAddress } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'
import { sensitiveAddressTypes } from '../utils/constants'

const addAddress = async (addressInput: AddressCreateInput, res: Response): Promise<Address & UserAddress> => {
  // TODO if new address isDefault, set false to the previous
  // TODO transfor all sequence db calls to transactions

  const { isDefault, addr, addressTypeID } = addressInput

  const existingAddresses = await db<Address & UserAddress>('addresses as a')
    .joinRaw('LEFT JOIN "userAddresses" as ua USING ("addressID")')
    .where('addr', addr)
    .andWhere('addressTypeID', addressTypeID)

  let curUA // aka currentUserAddress

  if (!R.isEmpty(existingAddresses)) {
    curUA = existingAddresses.find((a) => a.userID === res.locals.userID)

    if (curUA) {
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
          userID: res.locals.userID
        }, [ '*' ])

      curUA = {
        addr,
        addressTypeID,
        ...addedUserAddress
      }
    }
  } else {
    curUA = await dbTrans(async (trx: Knex.Transaction) => {
      const [ addedAddress ]: Address[] = await trx
        .insert(R.omit([ 'isDefault' ], addressInput), [ '*' ])
        .into('addresses')

      if (!addedAddress) throw new StatusError()

      const [ addedUserAddress ]: UserAddress[] = await trx
        .insert({
          userID: res.locals.userID,
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
    .where('addressTypeID', req.params.addressTypeID)
}

type AddressFullData = Address & { userID: string; name: string }

const getAddressByID = async (req: Request, res: Response): Promise<AddressFullData> => {
  const address: AddressFullData = await db('addresses as a')
    .first(
      'a.addressID',
      'a.addr',
      'a.addressTypeID',
      'ua.userID',
      'at.name'
    )
    .where('addressID', req.params.addressID)
    .joinRaw('JOIN "userAddresses" as ua USING ("addressID")')
    .joinRaw('LEFT JOIN "addressTypes" as at USING ("addressTypeID")')

  if (!address) throw new StatusError(404, 'Not Found')

  const role: string | undefined = res.locals.userRole

  if (
    sensitiveAddressTypes.includes(address.name) &&
    (!role || ![ 'ROOT', 'ADMIN' ].includes(role)) &&
    address.userID !== res.locals.userID
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
