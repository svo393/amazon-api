import { Request, Response } from 'express'

export const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send('Unknown endpoint')
}
