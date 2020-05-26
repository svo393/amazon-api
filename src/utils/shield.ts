import { Request, Response } from 'express'
import { db } from './db'
import StatusError from './StatusError'

type Entities =
  | 'lists'

const hasRole = (roles: string[], res: Response): boolean => {
  const role: string | undefined = res.locals.userRole
  return Boolean(role && roles.includes(role))
}

const isLoggedIn = (res: Response): void => {
  if (!res.locals.userID) throw new StatusError(403, 'Forbidden')
}

const isRoot = (res: Response): void => {
  isLoggedIn(res)
  if (res.locals.userRole !== 'ROOT') throw new StatusError(403, 'Forbidden')
}

const isAdmin = (res: Response): void => {
  isLoggedIn(res)
  const role: string | undefined = res.locals.userRole

  if (!role || ![ 'ROOT', 'ADMIN' ].includes(role)) { throw new StatusError(403, 'Forbidden') }
}

const isSameUser = (req: Request, res: Response, target: 'params' | 'query' | 'body'): void => {
  isLoggedIn(res)

  if (
    res.locals.userID.toString() !== req[target].userID.toString() &&
    res.locals.userRole !== 'ROOT'
  ) {
    throw new StatusError(403, 'Forbidden')
  }
}

const isSameUserOrAdmin = (req: Request, res: Response, target: 'params' | 'query' | 'body'): void => {
  isLoggedIn(res)

  if (
    res.locals.userID.toString() !== req[target].userID.toString() &&
    ![ 'ROOT', 'ADMIN' ].includes(res.locals.userRole)
  ) throw new StatusError(403, 'Forbidden')
}

const isCreator = async (res: Response, entity: Entities, idName: string, id: number): Promise<void | null> => {
  isLoggedIn(res)
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
  isLoggedIn,
  isAdmin,
  isCreator,
  isRoot,
  isSameUser,
  hasRole,
  isSameUserOrAdmin
}
