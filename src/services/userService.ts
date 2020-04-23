import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInput, AuthUserPersonalData, NonSensitiveUser } from '../types'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

const addUser = async (userInput: UserInput): Promise<AuthUserPersonalData> => {
  const { email, password } = userInput

  if (password.length < 8) {
    throw new StatusError(422, 'Password must be at least 8 characters')
  }

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
      cart: true,
      role: true
    }
  })

  prisma.disconnect()

  const token = jwt.sign(
    { userID: addedUser.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  )

  return { ...addedUser, token }
}

const loginUser = async (userInput: UserInput): Promise<AuthUserPersonalData> => {
  const { email, password } = userInput

  const existingUser = await prisma.user.findOne({
    where: { email },
    select: {
      avatar: true,
      email: true,
      id: true,
      name: true,
      cart: true,
      role: true,
      password: true
    }
  })

  if (!existingUser) {
    throw new StatusError(401, 'Invalid Email or Password')
  }

  const passwordIsValid = await bcrypt.compare(password, existingUser.password)

  if (!passwordIsValid) {
    throw new StatusError(401, 'Invalid Email or Password')
  }

  prisma.disconnect()

  const token = jwt.sign(
    { userID: existingUser.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  )

  delete existingUser.password

  return { ...existingUser, token }
}

const getUsers = async (): Promise<NonSensitiveUser[]> => {
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

const getUserByID = async (id: string): Promise<NonSensitiveUser | null> => {
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

export default {
  addUser,
  getUsers,
  getUserByID,
  loginUser
}
