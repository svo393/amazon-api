import { Request } from 'express'
import { map, omit } from 'ramda'
import { Role, User, UserSafeData } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addRole = async (roleInput: Role): Promise<Role> => {
  const {
    rows: [addedRole]
  }: { rows: Role[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [db('roles').insert(roleInput)]
  )

  if (addedRole === undefined) {
    throw new StatusError(
      409,
      `Role with name "${roleInput.roleName}" already exists`
    )
  }
  return addedRole
}

const getRoles = async (): Promise<Role[]> => {
  return await db('roles').where('roleName', '!=', 'ROOT')
}

type SingleRoleData = Role & {
  users: UserSafeData[]
}

const updateRole = async (
  roleInput: Role,
  req: Request
): Promise<SingleRoleData> => {
  const [updatedRole]: Role[] = await db('roles')
    .update(roleInput, ['*'])
    .where('roleName', req.params.roleName)

  if (updatedRole === undefined)
    throw new StatusError(404, 'Not Found')

  const users = await db<User>('users').where(
    'role',
    req.params.roleName
  )

  return {
    ...updatedRole,
    users: map(
      omit(['password', 'resetToken', 'resetTokenCreatedAt']),
      users
    )
  }
}

const deleteRole = async (req: Request): Promise<void> => {
  const deleteCount = await db('roles')
    .del()
    .where('roleName', req.params.roleName)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addRole,
  getRoles,
  updateRole,
  deleteRole
}
