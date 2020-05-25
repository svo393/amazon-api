import { Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { Address, AddressCreateInput, User, UserSafeData, AddressFetchInput } from '../types'
import { sensitiveShippingMethods } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import shield from '../utils/shield'
import StatusError from '../utils/StatusError'

const addAddress = async (addressInput: AddressCreateInput): Promise<Address> => {
  const { addr, addressTypeID } = addressInput

  const existingAddress = await db<Address>('addresses')
    .first()
    .where('addr', addr)
    .andWhere('addressTypeID', addressTypeID)

  let addedAddress

  if (!existingAddress) {
    [ addedAddress ] = await db('addresses')
      .insert(addressInput, [ '*' ])
  }

  return existingAddress ?? addedAddress
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
