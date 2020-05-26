import { UserAddress, UserAddressFetchInput, UserAddressCreateInput, UserAddressUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addUserAddress = async (userAddressInput: UserAddressCreateInput): Promise<UserAddress> => {
  const { userID, addressID } = userAddressInput

  const existingUserAddress = await db<UserAddress>('userAddresses')
    .first()
    .where('userID', userID)
    .andWhere('addressID', addressID)

  if (existingUserAddress) throw new StatusError(409, 'Address already added')

  const [ addedUserAddress ]: UserAddress[] = await db<UserAddress>('userAddresses')
    .insert(userAddressInput, [ '*' ])

  return addedUserAddress
}

const getUserAddresses = async (userAddressInput: UserAddressFetchInput): Promise<UserAddress[]> => {
  const { userID } = userAddressInput

  return await db('userAddresses')
    .where('userID', userID)
}

const updateUserAddress = async (userAddressInput: UserAddressUpdateInput, addressID: number, userID: number): Promise<UserAddress> => {
  const { isDefault } = userAddressInput

  const [ updatedUserAddress ]: UserAddress[] = await db<UserAddress>('userAddresses')
    .update({ isDefault }, [ '*' ])
    .where('userID', userID)
    .andWhere('addressID', addressID)

  if (!updatedUserAddress) throw new StatusError(404, 'Not Found')
  return updatedUserAddress
}

const deleteUserAddress = async (addressID: number, userID: number): Promise<void> => {
  const deleteCount = await db<UserAddress>('userAddresses')
    .del()
    .where('userID', userID)
    .andWhere('addressID', addressID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress
}
