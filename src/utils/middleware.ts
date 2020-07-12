import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import env from './config'
import { db } from './db'
import logger from './logger'
import StatusError from './StatusError'

type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

type Target = 'params' | 'query' | 'body'

type Entities =
  | 'lists'
  | 'products'
  | 'ratings'
  | 'ratingComments'
  | 'questions'
  | 'answers'
  | 'answerComments'
  | 'cartProducts'
  | 'orderStatuses'
  | 'invoiceStatuses'
  | 'orders'
  | 'invoices'
  | 'images'

export const requireAuth: Middleware = (req, _, next) => {
  if (req.session?.userID === undefined) throw new StatusError(401, 'Unauthorized')
  next()
}

export const requireAdmin: Middleware = (req, _, next) => {
  const role: string | undefined = req.session?.role

  if (req.session?.userID === undefined || role === undefined) {
    throw new StatusError(401, 'Unauthorized')
  }

  if (![ 'ROOT', 'ADMIN' ].includes(role)) {
    throw new StatusError(403, 'Forbidden')
  }
  next()
}

export const requireRoot: Middleware = (req, _, next) => {
  const role: string | undefined = req.session?.role

  if (req.session?.userID === undefined ||
    role === undefined) {
    throw new StatusError(401, 'Unauthorized')
  }

  if (role !== 'ROOT') { throw new StatusError(403, 'Forbidden') }
  next()
}

export const requireSameUser = (target: Target): Middleware => {
  const fn: Middleware = (req, _, next) => {
    const userID: string | undefined = req.session?.userID

    if (userID === undefined) throw new StatusError(401, 'Unauthorized')

    if (userID.toString() !== req[target].userID.toString() &&
      req.session?.role !== 'ROOT') {
      throw new StatusError(403, 'Forbidden')
    }
    next()
  }
  return fn
}

export const requireSameUserOrAdmin = (target: Target): Middleware => {
  const fn: Middleware = (req, _, next) => {
    const userID: string | undefined = req.session?.userID

    if (userID === undefined) throw new StatusError(401, 'Unauthorized')

    if (userID.toString() !== req[target].userID.toString() &&
      ![ 'ROOT', 'ADMIN' ].includes(req.session?.role)) {
      throw new StatusError(403, 'Forbidden')
    }
    next()
  }
  return fn
}

export const requireCreator = (entity: Entities, idName: string, target: Target): Middleware => {
  const fn: Middleware = async (req, _, next) => {
    if (req.session?.userID === undefined) {
      throw new StatusError(401, 'Unauthorized')
    }
    if (req.session?.role === 'ROOT') return next()

    const data = await db(entity)
      .first('userID')
      .where(idName, req[target][idName])

    if (data === undefined) throw new StatusError(404, 'Not Found')

    if (data.userID.toString() !== req.session?.userID.toString()) {
      throw new StatusError(403, 'Forbidden')
    }
    next()
  }
  return fn
}

export const requireCreatorOrAdmin = (entity: Entities, idName: string, target: Target): Middleware => {
  const fn: Middleware = async (req, _, next) => {
    if (req.session?.userID === undefined) {
      throw new StatusError(401, 'Unauthorized')
    }

    const role: string | undefined = req.session?.role
    if (role !== undefined && [ 'ROOT', 'ADMIN' ].includes(role)) return next()

    const data = await db(entity)
      .first('userID')
      .where(idName, req[target][idName])

    if (data === undefined) throw new StatusError(404, 'Not Found')

    if (data.userID.toString() !== req.session?.userID.toString()) {
      throw new StatusError(403, 'Forbidden')
    }
    next()
  }
  return fn
}

export const unknownEndpoint: Middleware = (req, res) => {
  res.status(405).json({ error: `Method ${req.method} is not allowed` })
}

export const errorHandler = (
  error: StatusError, _: Request, res: Response, next: NextFunction
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
  filename (_, file, cb) { cb(null, `${Date.now()}_${file.originalname}`) }
})

export const multerUpload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: (_, file, cb) => {
    if ([ 'image/png', 'image/jpg', 'image/jpeg', 'image/webp' ].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new StatusError(415, 'Only .png, .jpg, .jpeg and .webp formats allowed'))
    }
  }
})
