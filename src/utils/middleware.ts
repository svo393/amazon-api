import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import env from './config'
import logger from './logger'
import StatusError from './StatusError'
import db from './db'

type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

type DecodedToken = {
  userID: string;
  iat: number;
  exp: number;
}

export const getUserID: Middleware = async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const decodedToken = jwt.verify(req.cookies.token, env.JWT_SECRET)
      res.locals.userID = (decodedToken as DecodedToken).userID

      const role: { name: string } | null = await db('users')
        .first('r.name')
        .where('userID', res.locals.userID)
        .joinRaw('JOIN roles as r USING ("roleID")')

      if (!role) {
        res.clearCookie('token')
        throw new StatusError(403, 'Forbidden')
      }
      res.locals.userRole = role.name
    } catch (_err) {
      res.clearCookie('token')
      throw new StatusError(403, 'Forbidden')
    }
  }
  next()
}

export const unknownEndpoint: Middleware = (req, res) => {
  res.status(405).json({ error: `Method ${req.method} is not allowed` })
}

export const errorHandler = (
  error: StatusError, _req: Request, res: Response, next: NextFunction
): void => {
  const statusCode = error.statusCode ? error.statusCode : 500
  env.NODE_ENV === 'test' && logger.error(error)

  res.status(statusCode).json({
    status: statusCode,
    error: error.message
  })

  next(error)
}
