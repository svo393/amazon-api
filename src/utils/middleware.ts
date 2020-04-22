import { NextFunction, Request, Response } from 'express'
import logger from './logger'

export const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send('Unknown endpoint')
}

export const errorHandler = (
  error: Error, _req: Request, res: Response, next: NextFunction
): void => {
  logger.error(error.message)

  if (
    error.name === 'CastError' &&
    error.message.includes('Cast to ObjectId failed')
  ) {
    res.status(400).send('malformatted id')
  } else if (error.name === 'ValidationError') {
    res.status(400).send(error.message)
  } else if (error.name === 'JsonWebTokenError') {
    res.status(401).send('invalid token')
  }

  next(error)
}
