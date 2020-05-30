import { Request } from 'express'
import { UserAddress, UserAddressCreateInput as UACreateInput, UserAddressUpdateInput as UAUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addUserAddress = async (UAInput: UACreateInput): Promise<UserAddress> => {
  const { rows: [ addedUA ] }: { rows: UserAddress[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('userAddresses').insert(UAInput) ]
  )

  if (!addedUA) throw new StatusError(409, 'Address already added')
  return addedUA
}

const updateUserAddress = async (UAInput: UAUpdateInput, req: Request): Promise<UserAddress> => {
  const { isDefault } = UAInput

  const [ updatedUA ]: UserAddress[] = await db<UserAddress>('userAddresses')
    .update({ isDefault }, [ '*' ])
    .where('userID', req.params.userID)
    .andWhere('addressID', req.params.addressID)

  if (!updatedUA) throw new StatusError(404, 'Not Found')
  return updatedUA
}

const deleteUserAddress = async (req: Request): Promise<void> => {
  const deleteCount = await db<UserAddress>('userAddresses')
    .del()
    .where('userID', req.params.userID)
    .andWhere('addressID', req.params.addressID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addUserAddress,
  updateUserAddress,
  deleteUserAddress
}
