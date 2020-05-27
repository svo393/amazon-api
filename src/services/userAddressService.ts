import { UserAddress, UserAddressFetchInput as UAFetchInput, UserAddressCreateInput as UACreateInput, UserAddressUpdateInput as UAUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addUserAddress = async (UAInput: UACreateInput): Promise<UserAddress> => {
  const { userID, addressID } = UAInput

  const existingUA = await db<UserAddress>('userAddresses')
    .first()
    .where('userID', userID)
    .andWhere('addressID', addressID)

  if (existingUA) throw new StatusError(409, 'Address already added')

  const [ addedUA ]: UserAddress[] = await db<UserAddress>('userAddresses')
    .insert(UAInput, [ '*' ])

  return addedUA
}

const getUserAddresses = async (UAInput: UAFetchInput): Promise<UserAddress[]> => {
  const { userID } = UAInput

  return await db('userAddresses')
    .where('userID', userID)
}

const updateUserAddress = async (UAInput: UAUpdateInput, addressID: number, userID: number): Promise<UserAddress> => {
  const { isDefault } = UAInput

  const [ updatedUA ]: UserAddress[] = await db<UserAddress>('userAddresses')
    .update({ isDefault }, [ '*' ])
    .where('userID', userID)
    .andWhere('addressID', addressID)

  if (!updatedUA) throw new StatusError(404, 'Not Found')
  return updatedUA
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
