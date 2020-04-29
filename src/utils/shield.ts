import { PrismaClient, Role } from '@prisma/client'
import { Response, Request } from 'express'
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

export const getUserRole = async (res: Response): Promise<Role | null> => {
  const userID = res.locals.userID

  if (!userID) { return null }

  const user = await prisma.user.findOne({
    where: { id: userID },
    select: { role: true }
  })
  await prisma.disconnect()

  if (!user) { throw new StatusError(500, 'Internal Server Error') }
  return user.role
}

const isLoggedIn = (res: Response): void => {
  if (!res.locals.userID) { throw new StatusError(403, 'Forbidden', '/login') }
}

const isRoot = async (res: Response): Promise<void> => {
  isLoggedIn(res)
  const role = await getUserRole(res)
  if (role !== 'ROOT') { throw new StatusError(403, 'Forbidden') }
}

const isAdmin = async (res: Response): Promise<void> => {
  isLoggedIn(res)
  const role = await getUserRole(res)

  if (!role || ![ 'ROOT', 'ADMIN' ].includes(role)) {
    throw new StatusError(403, 'Forbidden')
  }
}

const isSameUser = (req: Request, res: Response): void => {
  isLoggedIn(res)

  if (res.locals.userID !== req.params.id) {
    throw new StatusError(403, 'Forbidden')
  }
}

const isCreator = async (res: Response, name: Model, id: string): Promise<void | null> => {
  isLoggedIn(res)
  const userID = res.locals.userID
  const role = await getUserRole(res)

  if (role === 'ROOT') return null

  let data

  const params = {
    where: { id },
    include: { user: true }
  }

  switch (name) {
    case 'item':
      data = await prisma.item.findOne(params)
      break
    case 'cartItem':
      data = await prisma.cartItem.findOne(params)
      break
    case 'order':
      data = await prisma.order.findOne(params)
      break
    case 'orderItem':
      data = await prisma.orderItem.findOne(params)
      break
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

  if (!data) { throw new StatusError(404, 'Not Found') }
  if (data.user.id !== userID) { throw new StatusError(403, 'Forbidden') }
}

export default {
  isLoggedIn,
  isAdmin,
  isCreator,
  isRoot,
  isSameUser
}
