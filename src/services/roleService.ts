import { Role, User, RoleInput, UserSafeData } from '../types'
import { db } from '../utils/db'
import R from 'ramda'
import StatusError from '../utils/StatusError'

const addRole = async (roleInput: RoleInput): Promise<Role> => {
  const { name } = roleInput

  const existingRole = await db<Role>('roles')
    .first('roleID')
    .where('name', name)

  if (existingRole) {
    throw new StatusError(409, `Role with name "${name}" already exists`)
  }

  const [ addedRole ]: Role[] = await db<Role>('roles')
    .insert(roleInput, [ '*' ])

  return addedRole
}

const getRoles = async (): Promise<Role[]> => {
  return await db<Role>('roles')
}

type SingleRoleData = {
  name: string;
  users: UserSafeData[];
}

const getRoleByID = async (roleID: number): Promise<SingleRoleData> => {
  const roles = await db<Role>('roles')
  const [ role ] = roles.filter((c) => c.roleID === roleID)
  if (!role) throw new StatusError(404, 'Not Found')

  const users = await db<User>('users')
    .where('roleID', roleID)

  return {
    ...role,
    users: R.map(R.omit([
      'password',
      'resetToken',
      'resetTokenCreatedAt'
    ]), users)
  }
}

const updateRole = async (roleInput: RoleInput, roleID: number): Promise<SingleRoleData> => {
  const [ updatedRole ] = await db<Role>('roles')
    .update({ ...roleInput }, [ 'roleID' ])
    .where('roleID', roleID)

  if (!updatedRole) throw new StatusError(404, 'Not Found')
  return getRoleByID(updatedRole.roleID)
}

export default {
  addRole,
  getRoles,
  getRoleByID,
  updateRole
}
