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

// type SingleAddressData = {
//   name: string;
//   users: UserSafeData[];
// }

// // addAddress first
// const getAddressByID = async (addressID: number, res: Response): Promise<SingleAddressData> => {
//   const hasPermission = shield.hasRole([ 'ROOT', 'ADMIN' ], res)

//   const addresses = hasPermission
//     ? await db<Address>('addresses as a')
//       .where('addressID', addressID)
//       .joinRaw('JOIN userAddresses as ua USING ("addressID")')
//       .join('users as u', 'ua.userID', 'u.userID')
//     : await db<Address>('addresses')
//       .where('addressID', addressID)

//   const [ address ] = addresses.filter((c) => c.addressID === addressID)
//   if (!address) throw new StatusError(404, 'Not Found')

//   const users = await db<User>('users')
//     .where('addressID', addressID)

//   return {
//     ...address,
//     users: R.map(R.omit([
//       'password',
//       'resetToken',
//       'resetTokenCreatedAt'
//     ]), users)
//   }
// }

// const updateAddress = async (addressInput: AddressUpdateInput, addressID: number): Promise<SingleAddressData> => {
//   const [ updatedAddress ] = await db<Address>('addresses')
//     .update({ ...addressInput }, [ 'addressID' ])
//     .where('addressID', addressID)

//   if (!updatedAddress) throw new StatusError(404, 'Not Found')
//   return getAddressByID(updatedAddress.addressID)
// }

export default {
  addAddress,
  getAddresses
  // getAddressByID
  // updateAddress
}
