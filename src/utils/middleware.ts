import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import env from './config'
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
      const decodedToken = jwt.verify(req.cookies.token, env.JWT_SECRET)
      res.locals.userID = (decodedToken as DecodedToken).userID
    } catch (_err) {
      res.clearCookie('token')
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

  res.status(statusCode).json({
    status: statusCode,
    error: error.message
  })

  next(error)
}
