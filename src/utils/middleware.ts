import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { DecodedToken } from '../types'
import { JWT_SECRET } from './config'
import StatusError from './StatusError'

export const getUserID = (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies.token) {
    try {
      const decodedToken = jwt.verify(req.cookies.token, JWT_SECRET as string)
      req.userID = (decodedToken as DecodedToken).userID
    } catch (_err) {
      res.clearCookie('token')
    }
  }
  next()
}

export const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send('Unknown endpoint')
}

export const errorHandler = (
  error: StatusError, _req: Request, res: Response, next: NextFunction
): void => {
  const statusCode = error.statusCode
    ? error.statusCode
    : 500

  error.location
    ? res.status(statusCode).json({ location: error.location })
    : res.status(statusCode).send(error.message)

  next(error)
}
