import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import StatusError from './StatusError'

type Model =
  | 'item'
  | 'cartItem'
  | 'order'
  | 'orderItem'
  | 'rating'
  | 'ratingComment'
  | 'question'
  | 'answer'
  | 'answerComment'

const prisma = new PrismaClient()

const isLoggedIn = (res: Response): void => {
  if (!res.locals.userID) throw new StatusError(403, 'Forbidden')
}

const isRoot = (res: Response): void => {
  isLoggedIn(res)

  if (res.locals.userRole !== 'ROOT') throw new StatusError(403, 'Forbidden')
}

const isAdmin = (res: Response): void => {
  isLoggedIn(res)
  const role = res.locals.userRole

  if (!role || ![ 'ROOT', 'ADMIN' ].includes(role)) {
    throw new StatusError(403, 'Forbidden')
  }
}

const isSameUser = (req: Request, res: Response): void => {
  isLoggedIn(res)

  if (res.locals.userID.toString() !== req.params.userID && res.locals.userRole !== 'ROOT') {
    throw new StatusError(403, 'Forbidden')
  }
}

const isCreator = async (res: Response, name: Model, id: string): Promise<void | null> => {
  isLoggedIn(res)
  if (res.locals.userRole === 'ROOT') return null

  let data

  const params = {
    where: { id },
    include: { user: true }
  }

  switch (name) {
    case 'item':
      data = await prisma.item.findOne(params)
      break
    // case 'cartItem':
    //   data = await prisma.cartItem.findOne(params)
    //   break
    case 'order':
      data = await prisma.order.findOne(params)
      break
    // case 'orderItem':
    //   data = await prisma.orderItem.findOne(params)
    //   break
    case 'question':
      data = await prisma.item.findOne(params)
      break
    case 'rating':
      data = await prisma.rating.findOne(params)
      break
    case 'ratingComment':
      data = await prisma.ratingComment.findOne(params)
      break
    case 'answer':
      data = await prisma.answer.findOne(params)
      break
    case 'answerComment':
      data = await prisma.answerComment.findOne(params)
      break
    default:
      throw new StatusError(500, 'Internal Server Error')
  }
  await prisma.disconnect()

  if (!data) throw new StatusError(404, 'Not Found')
  if (data.user.id !== res.locals.userID) throw new StatusError(403, 'Forbidden')
}

export default {
  isLoggedIn,
  isAdmin,
  isCreator,
  isRoot,
  isSameUser
}
