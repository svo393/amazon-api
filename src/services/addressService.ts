import { Response } from 'express'
import R from 'ramda'
import { Address, AddressCreateInput, AddressFetchInput, User, UserAddress, UserSafeData } from '../types'
import { sensitiveShippingMethods } from '../utils/constants'
import { db } from '../utils/db'
import shield from '../utils/shield'
import StatusError from '../utils/StatusError'

const addAddress = async (addressInput: AddressCreateInput, res: Response): Promise<any> => {
  const { name } = addressInput

  const existingAddress = await db<Address>('addresses')
    .first('addressID')
    .where('name', name)

  if (existingAddress) {
    throw new StatusError(409, `Address with name "${name}" already exists`)
  }

  return await db.transaction(async (trx) => {
    const [ addedAddress ]: Address[] = await trx
      .insert(addressInput, [ '*' ])
      .into('addresses')

    await trx
      .insert({
        userID: res.locals.userID,
        addressID: addedAddress.addressID
      }, [ '*' ])
      .into('userAddresses')

    return addedAddress
  })
}

const getaddresses = async (addressInput: AddressFetchInput, res: Response): Promise<Address[]> => {
  const { shippingMethodID } = addressInput

  const addresses: (Address & { smName: string })[] = await db('shippingMethods as sm')
    .select('a.addressID', 'a.name', 'sm.shippingMethodID', 'sm.name as smName')
    .where('shippingMethodID', shippingMethodID)
    .joinRaw('JOIN addresses as a USING ("shippingMethodID")')

  const hasPermission = shield.hasRole([ 'ROOT', 'ADMIN' ], res)

  if (!hasPermission && sensitiveShippingMethods.includes(addresses[0].smName)) {
    throw new StatusError(404, 'Not Found')
  }

  return addresses
}

type SingleAddressData = {
  name: string;
  users: UserSafeData[];
}

// addAddress first
const getAddressByID = async (addressID: number, res: Response): Promise<SingleAddressData> => {
  const hasPermission = shield.hasRole([ 'ROOT', 'ADMIN' ], res)

  const addresses = hasPermission
    ? await db<Address>('addresses as a')
      .where('addressID', addressID)
      .joinRaw('JOIN userAddresses as ua USING ("addressID")')
      .join('users as u', 'ua.userID', 'u.userID')
    : await db<Address>('addresses')
      .where('addressID', addressID)

  const [ address ] = addresses.filter((c) => c.addressID === addressID)
  if (!address) throw new StatusError(404, 'Not Found')

  const users = await db<User>('users')
    .where('addressID', addressID)

  return {
    ...address,
    users: R.map(R.omit([
      'password',
      'resetToken',
      'resetTokenCreatedAt'
    ]), users)
  }
}

// const updateAddress = async (addressInput: AddressUpdateInput, addressID: number): Promise<SingleAddressData> => {
//   const [ updatedAddress ] = await db<Address>('addresses')
//     .update({ ...addressInput }, [ 'addressID' ])
//     .where('addressID', addressID)

//   if (!updatedAddress) throw new StatusError(404, 'Not Found')
//   return getAddressByID(updatedAddress.addressID)
// }

export default {
  addAddress,
  getaddresses,
  getAddressByID
  // updateAddress
}
