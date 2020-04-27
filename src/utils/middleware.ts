import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config'
import StatusError from './StatusError'

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

export const getUserID: Middleware = (req, res, next) => {
  if (req.cookies.token) {
    try {
      const decodedToken = jwt.verify(req.cookies.token, JWT_SECRET as string)
      res.locals.userID = (decodedToken as DecodedToken).userID
    } catch (_err) {
      res.clearCookie('token')
    }
  }
  next()
}

export const unknownEndpoint: Middleware = (_req, res) => {
  res.status(404).json({ error: 'Not Found' })
}

export const errorHandler = (
  error: StatusError, _req: Request, res: Response, next: NextFunction
): void => {
  const statusCode = error.statusCode
    ? error.statusCode
    : 500

  error.location
    ? res.status(statusCode).json({ error: error.message, location: error.location })
    : res.status(statusCode).json({ error: error.message })

  next(error)
}
