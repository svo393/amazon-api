import { Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { Address, AddressCreateInput, AddressFetchInput, UserAddress } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addAddress = async (addressInput: AddressCreateInput, res: Response): Promise<Address & UserAddress> => {
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
        const [ updatedUserAddress ]: UserAddress[] = await db<UserAddress>('userAddresses')
          .where('userID', curUA.userID)
          .andWhere('addressID', curUA.addressID)
          .update({ isDefault }, [ '*' ])

        curUA = { ...curUA, ...updatedUserAddress }
      }
    } else {
      const [ addedUserAddress ]: UserAddress[] = await db<UserAddress>('userAddresses')
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

const getAddresses = async (addressInput: AddressFetchInput): Promise<(Address & { userID?: number })[] | void> => {
  const { userID, addressTypeID } = addressInput

  if (addressTypeID) {
    return await db('addresses')
      .where('addressTypeID', addressTypeID)
  }

  if (userID) {
    return await db('addresses as a')
      .select('a.addressID', 'a.addr', 'a.addressTypeID', 'ua.userID')
      .joinRaw('JOIN userAdresses as ua USING (addressID)')
      .where('ua.userID', userID)
  }
}

const getAddressByID = async (addressID: number): Promise<Address> => {
  const address = await db<Address>('addresses')
    .first()
    .where('addressID', addressID)

  if (!address) throw new StatusError(404, 'Not Found')

  return address
}

export default {
  addAddress,
  getAddresses,
  getAddressByID
}
