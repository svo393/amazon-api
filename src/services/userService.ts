import { PrismaClient, User, UserCreateInput, UserGetPayload, UserUpdateInput } from '@prisma/client'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { CookieOptions, Response } from 'express'
import jwt from 'jsonwebtoken'
import R from 'ramda'
import { promisify } from 'util'
import { PasswordResetInput, UserLoginInput } from '../types'
import env from '../utils/config'
import { getUserRole } from '../utils/shield'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

const userFieldSet = {
  cart: {
    include: { item: true }
  },
  items: true,
  orders: true,
  orderItems: true,
  ratings: true,
  ratingComments: true,
  questions: true,
  answers: true,
  answerComments: true
}

type UserListData = Omit<User,
  | 'password'
  | 'resetToken'
  | 'resetTokenExpiry'
> & {
  ordersCount: number;
  ratingCount: number;
  questionsCount: number;
}

type UserAllData = UserGetPayload<{
  include: typeof userFieldSet;
}>

type UserPersonalData = Omit<UserAllData,
  | 'password'
  | 'resetToken'
  | 'resetTokenExpiry'
>

type UserPublicData = Omit<UserPersonalData,
  | 'email'
  | 'createdAt'
  | 'role'
  | 'cart'
  | 'items'
  | 'orders'
  | 'orderItems'
  >

const setTokenCookie = (res: Response, token: string, remember: boolean): void => {
  const config: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax'
  }

  !remember && delete config.maxAge

  res.cookie('token', token, config)
}

const addUser = async (userInput: UserCreateInput, res: Response): Promise<UserPersonalData> => {
  const { email, password } = userInput

  const existingUser = await prisma.user.findOne({
    where: { email },
    select: { id: true }
  })

  if (existingUser) {
    await prisma.disconnect()
    throw new StatusError(409, `User with email "${email}" already exists`)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const addedUser = await prisma.user.create({
    data: { email, password: passwordHash },
    include: userFieldSet
  })
  await prisma.disconnect()

  const token = jwt.sign(
    { userID: addedUser.id },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  setTokenCookie(res, token, true)

  const userData = R.omit([
    'password',
    'resetToken',
    'resetTokenExpiry'
  ], addedUser)

  return userData
}

const loginUser = async (userInput: UserLoginInput, res: Response): Promise<UserPersonalData> => {
  const { email, password, remember } = userInput

  const existingUser = await prisma.user.findOne({
    where: { email },
    include: userFieldSet
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

  const token = jwt.sign(
    { userID: existingUser.id },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  setTokenCookie(res, token, remember)

  const userData = R.omit([
    'password',
    'resetToken',
    'resetTokenExpiry'
  ], existingUser)

  return userData
}

const getUsers = async (): Promise<UserListData[]> => {
  const users = await prisma.user.findMany({
    where: { role: { not: 'ROOT' } },
    include: {
      orders: true,
      ratings: true,
      questions: true
    }
  })
  await prisma.disconnect()

  const usersWithCounts = users.map((u) => ({
    ...u,
    ordersCount: u.orders.length,
    ratingCount: u.ratings.length,
    questionsCount: u.questions.length
  }))

  const usersData = R.map(
    R.pipe(
      R.omit([
        'password',
        'resetToken',
        'resetTokenExpiry',
        'orders',
        'ratings',
        'questions'
      ])
    ))(usersWithCounts)

  return usersData
}

const getUserByID = async (id: string, res: Response): Promise<UserPersonalData | UserPublicData> => {
  const user = await prisma.user.findOne({
    where: { id },
    include: userFieldSet
  })
  await prisma.disconnect()

  if (!user) {
    throw new StatusError(404, 'Not Found')
  }
  const role = await getUserRole(res)
  const userHasPermission = role === 'ROOT' || res.locals.userID === id

  const userData = userHasPermission
    ? R.omit([
      'password',
      'resetToken',
      'resetTokenExpiry'
    ], user)
    : R.pick([
      'id',
      'name',
      'avatar',
      'ratings',
      'ratingComments',
      'questions',
      'answers',
      'answerComments'
    ], user)

  return userData
}

const updateUser = async (userInput: UserUpdateInput, id: string): Promise<UserPersonalData> => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { ...userInput },
    include: userFieldSet
  })
  await prisma.disconnect()

  if (!updatedUser) {
    throw new StatusError(404, 'Not Found')
  }

  const userData = R.omit([
    'password',
    'resetToken',
    'resetTokenExpiry'
  ], updatedUser)

  return userData
}

const sendPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.user.findOne({ where: { email } })
  if (!user) throw new StatusError(401, 'Invalid email')

  const resetToken = (await promisify(randomBytes)(20)).toString('hex')
  const resetTokenExpiry = (Date.now() + 1000 * 60 * 60).toString()

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry },
    select: { id: true }
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

const resetPassword = async ({ password, resetToken }: PasswordResetInput, res: Response): Promise<UserPersonalData> => {
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
    },
    include: userFieldSet
  })
  await prisma.disconnect()

  const token = jwt.sign(
    { userID: updatedUser.id },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  setTokenCookie(res, token, true)

  const userData = R.omit([
    'password',
    'resetToken',
    'resetTokenExpiry'
  ], updatedUser)

  return userData
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
