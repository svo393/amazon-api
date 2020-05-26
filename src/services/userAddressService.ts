import { UserAddress, UserAddressFetchInput, UserAddressCreateInput } from '../types'
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

// const getUserAddresss = async (userAddressInput: UserAddressFetchInput): Promise<UserAddress[] | void> => {
//   const { userID, follows } = userAddressInput

//   if (follows) {
//     return await db('userAddresses')
//       .where('follows', follows)
//   }

//   if (userID) {
//     return await db('userAddresses')
//       .where('userID', userID)
//   }
// }

// const deleteUserAddress = async (userID: number, follows: number): Promise<void> => {
//   const deleteCount = await db<UserAddress>('userAddresses')
//     .del()
//     .where('userID', userID)
//     .andWhere('follows', follows)

//   if (deleteCount === 0) throw new StatusError(404, 'Not Found')
// }

export default {
  addUserAddress
  // getUserAddresss,
  // deleteUserAddress
}
