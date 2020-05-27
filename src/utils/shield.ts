import { Request, Response } from 'express'
import { db } from './db'
import StatusError from './StatusError'

type Entities =
  | 'lists'
  | 'products'

const hasRole = (roles: string[], res: Response): boolean => {
  const role: string | undefined = res.locals.userRole
  return Boolean(role && roles.includes(role))
}

const isCreator = async (res: Response, entity: Entities, idName: string, id: number): Promise<void | null> => {
  if (res.locals.userRole === 'ROOT') return null

  const data = await db(entity)
    .first('userID')
    .where(idName, id)

  if (!data) throw new StatusError(404, 'Not Found')

  if (data.userID.toString() !== res.locals.userID.toString()) {
    throw new StatusError(403, 'Forbidden')
  }
}

export default {
  isCreator,
  hasRole
}
