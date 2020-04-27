import { PrismaClient, UserCreateInput, UserUpdateInput } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthUserPersonalData, UserPersonalData } from '../types'
import env from '../utils/config'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

const addUser = async (userInput: UserCreateInput): Promise<AuthUserPersonalData> => {
  const { email, password } = userInput

  const existingUser = await prisma.user.findOne({
    where: { email },
    select: { id: true }
  })

  if (existingUser) {
    throw new StatusError(409, `User with email ${email} already exists`)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const addedUser = await prisma.user.create({
    data: { email, password: passwordHash },
    select: {
      avatar: true,
      email: true,
      id: true,
      name: true,
      role: true,
      createdAt: true
    }
  })

  prisma.disconnect()

  const token = jwt.sign(
    { userID: addedUser.id },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  return {
    ...addedUser,
    cart: [],
    token
  }
}

const loginUser = async (userInput: UserCreateInput): Promise<AuthUserPersonalData> => {
  const { email, password } = userInput

  const existingUser = await prisma.user.findOne({
    where: { email },
    select: {
      avatar: true,
      email: true,
      id: true,
      name: true,
      role: true,
      password: true,
      createdAt: true
    }
  })

  if (!existingUser) {
    throw new StatusError(401, 'Invalid Email or Password')
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password)

  if (!isPasswordValid) {
    throw new StatusError(401, 'Invalid Email or Password')
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { user: { id: existingUser.id } },
    include: { item: true }
  })

  prisma.disconnect()

  const token = jwt.sign(
    { userID: existingUser.id },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  delete existingUser.password

  return {
    ...existingUser,
    cart: cartItems,
    token
  }
}

const getUsers = async (): Promise<UserPersonalData[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      role: true,
      cart: true
    }
  })
  prisma.disconnect()
  return users
}

const getUserByID = async (id: string): Promise<UserPersonalData | null> => {
  const user = await prisma.user.findOne({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      role: true,
      cart: true
    }
  })
  prisma.disconnect()
  return user
}

const updateUser = async (userInput: UserUpdateInput, id: string): Promise<UserPersonalData> => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { ...userInput },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      role: true,
      cart: true
    }
  })

  const cartItems = await prisma.cartItem.findMany({
    where: { user: { id: updatedUser.id } },
    include: { item: true }
  })

  prisma.disconnect()

  return {
    ...updatedUser,
    cart: cartItems
  }
}

export default {
  addUser,
  getUsers,
  getUserByID,
  loginUser,
  updateUser
}
