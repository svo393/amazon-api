import { PrismaClient, UserCreateInput, UserGetPayload, UserUpdateInput } from '@prisma/client'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { PasswordResetInput } from '../types'
import env from '../utils/config'
import { getUserRole } from '../utils/shield'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

type UserPersonalData = UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    avatar: true;
    createdAt: true;
    role: true;
    cart: true;
  };
}>

type UserPublicData = UserGetPayload<{
  select: {
    id: true;
    name: true;
    avatar: true;
  };
}>

type AuthUserPersonalData = UserPersonalData & {
  token: string;
}

const addUser = async (userInput: UserCreateInput): Promise<AuthUserPersonalData> => {
  const { email, password } = userInput

  const existingUser = await prisma.user.findOne({
    where: { email },
    select: { id: true }
  })

  if (existingUser) {
    await prisma.disconnect()
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
  await prisma.disconnect()

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
    await prisma.disconnect()
    throw new StatusError(401, 'Invalid Email or Password')
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password)

  if (!isPasswordValid) {
    await prisma.disconnect()
    throw new StatusError(401, 'Invalid Email or Password')
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { user: { id: existingUser.id } },
    include: { item: true }
  })
  await prisma.disconnect()

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

const getUsers = async (): Promise<Omit<UserPersonalData, 'cart'>[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      role: true
    }
  })
  await prisma.disconnect()
  return users
}

const getUserByID = async (id: string, res: Response): Promise<UserPersonalData | UserPublicData> => {
  const role = await getUserRole(res)
  const userHasPermission = role === 'ROOT' || res.locals.userID === id

  const fieldSet = userHasPermission
    ? {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      role: true,
      cart: true
    }
    : {
      id: true,
      name: true,
      avatar: true
    }

  const user = await prisma.user.findOne({
    where: { id },
    select: fieldSet
  })

  if (!user) {
    await prisma.disconnect()
    throw new StatusError(404, 'Not Found')
  }

  if (userHasPermission) {
    const cartItems = await prisma.cartItem.findMany({
      where: { user: { id } },
      include: { item: true }
    })
    user.cart = cartItems
  }
  await prisma.disconnect()

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
      role: true
    }
  })

  if (!updatedUser) {
    await prisma.disconnect()
    throw new StatusError(404, 'Not Found')
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { user: { id: updatedUser.id } },
    include: { item: true }
  })
  await prisma.disconnect()

  return {
    ...updatedUser,
    cart: cartItems
  }
}

const sendPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.user.findOne({ where: { email } })
  if (!user) { throw new StatusError(401, 'Invalid email') }

  const resetToken = (await promisify(randomBytes)(20)).toString('hex')
  const resetTokenExpiry = (Date.now() + 1000 * 60 * 60).toString()

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry }
  })
  await prisma.disconnect()

  try {
    // await transport.sendMail({
    //   from: 'ecom@example.com',
    //   to: email,
    //   subject: 'Your Password Reset Token',
    //   html: makeANiceEmail(`Your Password Reset Token is Here!
    //       <br/>
    //       <a href="${env.BASE_URL}/reset-password?resetToken=${resetToken}">
    //         Click Here to Reset
    //       </a>`)
    // })
  } catch (_err) {
    throw new StatusError(500, 'Error requesting password reset. Please try again later.')
  }
}

const resetPassword = async ({ password, resetToken }: PasswordResetInput): Promise<AuthUserPersonalData> => {
  const user = await prisma.user.findOne({
    where: { resetToken },
    select: { id: true, resetTokenExpiry: true }
  })

  if (!user?.resetTokenExpiry || parseInt(user.resetTokenExpiry) < Date.now()) {
    await prisma.disconnect()
    throw new StatusError(401, 'Reset token is invalid or expired')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: null,
      resetTokenExpiry: null,
      password: passwordHash
    }
  })

  const cartItems = await prisma.cartItem.findMany({
    where: { user: { id: updatedUser.id } },
    include: { item: true }
  })
  await prisma.disconnect()

  const token = jwt.sign(
    { userID: updatedUser.id },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  delete updatedUser.password

  return {
    ...updatedUser,
    cart: cartItems,
    token
  }
}

export default {
  addUser,
  getUsers,
  getUserByID,
  loginUser,
  updateUser,
  sendPasswordReset,
  resetPassword
}
