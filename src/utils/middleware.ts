import { NextFunction, Request, Response } from 'express'
import StatusError from './StatusError'

export const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send('Unknown endpoint')
}

export const errorHandler = (
  error: StatusError, _req: Request, res: Response, next: NextFunction
): void => {
  error.statusCode
    ? res.status(error.statusCode).send(error.message)
    : res.status(500).send(error.message)
    // : res.status(500).send('Server error. Please try again later.')
  next(error)
}
