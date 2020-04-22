import { NextFunction, Request, Response } from 'express'

export const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send('Unknown endpoint')
}

export const errorHandler = (
  error: Error, _req: Request, res: Response, next: NextFunction
): void => {
  if (error.message.includes('Incorrect or missing')) {
    res.status(400).send(error.message)
  }

  next(error)
}
