import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { User } from '../types'
import env from './config'
import { db } from './db'
import logger from './logger'
import StatusError from './StatusError'

type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

type DecodedToken = {
  userID: number;
  iat: number;
  exp: number;
}

type Target = 'params' | 'query' | 'body'

type Entities =
  | 'lists'
  | 'products'
  | 'ratings'
  | 'ratingComments'
  | 'questions'
  | 'answers'
  | 'answerComments'

export const isLoggedIn: Middleware = (_req, res, next) => {
  if (!res.locals.userID) throw new StatusError(403, 'Forbidden')
  next()
}

export const isAdmin: Middleware = (_req, res, next) => {
  const role: string | undefined = res.locals.userRole

  if (
    !res.locals.userID ||
    !role ||
    ![ 'ROOT', 'ADMIN' ].includes(role)
  ) {
    throw new StatusError(403, 'Forbidden')
  }
  next()
}

export const isRoot: Middleware = (_req, res, next) => {
  const role: string | undefined = res.locals.userRole

  if (
    !res.locals.userID ||
    !role ||
    role !== 'ROOT'
  ) {
    throw new StatusError(403, 'Forbidden')
  }
  next()
}

export const isSameUser = (target: Target): Middleware => {
  const fn: Middleware = (req, res, next) => {
    const userID: string | undefined = res.locals.userID

    if (
      !userID ||
      (userID.toString() !== req[target].userID.toString() &&
      res.locals.userRole !== 'ROOT')
    ) {
      throw new StatusError(403, 'Forbidden')
    }
    next()
  }
  return fn
}

export const isSameUserOrAdmin = (target: Target): Middleware => {
  const fn: Middleware = (req, res, next) => {
    const userID: string | undefined = res.locals.userID

    if (
      !userID ||
      (userID.toString() !== req[target].userID.toString() &&
      ![ 'ROOT', 'ADMIN' ].includes(res.locals.userRole))
    ) {
      throw new StatusError(403, 'Forbidden')
    }
    next()
  }
  return fn
}

export const isCreator = (entity: Entities, idName: string, target: Target): Middleware => {
  const fn: Middleware = async (req, res, next) => {
    if (!res.locals.userID) throw new StatusError(403, 'Forbidden')
    if (res.locals.userRole === 'ROOT') return next()

    const data = await db(entity)
      .first('userID')
      .where(idName, req[target][idName])

    if (!data) throw new StatusError(404, 'Not Found')

    if (data.userID.toString() !== res.locals.userID.toString()) {
      throw new StatusError(403, 'Forbidden')
    }
    next()
  }
  return fn
}

export const getUserID: Middleware = async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const decodedToken = jwt.verify(req.cookies.token, env.JWT_SECRET)
      res.locals.userID = (decodedToken as DecodedToken).userID

      const role: { name: string } | null = await db<User>('users')
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

const storage = multer.diskStorage({
  destination: './tmp',
  filename (_req, file, cb) { cb(null, file.originalname) }
})

export const multerUpload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if ([ 'image/png', 'image/jpg', 'image/jpeg', 'image/webp' ].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new StatusError(400, 'Only .png, .jpg, .jpeg and .webp formats allowed'))
    }
  }
})
