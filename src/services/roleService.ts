import { Request } from 'express'
import R from 'ramda'
import { Role, RoleInput, User, UserSafeData } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addRole = async (roleInput: RoleInput): Promise<Role> => {
  const { rows: [ addedRole ] }: { rows: Role[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('roles').insert(roleInput) ]
  )

  if (!addedRole) {
    throw new StatusError(409, `Role with name "${roleInput.name}" already exists`)
  }
  return addedRole
}

const getRoles = async (): Promise<Role[]> => {
  return await db<Role>('roles')
}

type SingleRoleData = {
  name: string;
  users: UserSafeData[];
}

const getRoleByID = async (req: Request): Promise<SingleRoleData> => {
  const role = await db<Role>('roles')
    .first()
    .where('roleID', req.params.roleID)

  if (!role) throw new StatusError(404, 'Not Found')

  const users = await db<User>('users')
    .where('roleID', req.params.roleID)

  return {
    ...role,
    users: R.map(R.omit([
      'password',
      'resetToken',
      'resetTokenCreatedAt'
    ]), users)
  }
}

const updateRole = async (roleInput: RoleInput, req: Request): Promise<SingleRoleData> => {
  const [ updatedRole ]: Role[] = await db<Role>('roles')
    .update({ ...roleInput }, [ '*' ])
    .where('roleID', req.params.roleID)

  if (!updatedRole) throw new StatusError(404, 'Not Found')

  const users = await db<User>('users')
    .where('roleID', req.params.roleID)

  return {
    ...updatedRole,
    users: R.map(R.omit([
      'password',
      'resetToken',
      'resetTokenCreatedAt'
    ]), users)
  }
}

export default {
  addRole,
  getRoles,
  getRoleByID,
  updateRole
}
