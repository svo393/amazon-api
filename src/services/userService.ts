import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { CookieOptions, Response } from 'express'
import jwt from 'jsonwebtoken'
import R from 'ramda'
import { promisify } from 'util'
import { db } from '../../src/utils/db'
import { Answer, Order, PasswordRequestInput, PasswordResetInput, Question, Rating, Role, User, UserLoginInput, UserSafeData, UserSignupInput, UserUpdateInput } from '../types'
import env from '../utils/config'
import shield from '../utils/shield'
import StatusError from '../utils/StatusError'
// import { makeANiceEmail, transport } from '../utils/mail'

type UserBaseData = Omit<UserSafeData,
  | 'isDeleted'
  | 'roleID'
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

type UserSignupData = Pick<User, 'userID' | 'email'>

const addUser = async (userInput: UserSignupInput, res: Response): Promise<UserSignupData> => {
  const { email, password } = userInput

  const existingUser = await db<User>('users')
    .first('userID')
    .where('email', email)

  if (existingUser) {
    throw new StatusError(409, `User with email '${email}' already exists`)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const customerRoleID = await db<Role>('roles')
    .first('roleID')
    .where('name', 'CUSTOMER')

  if (!customerRoleID) { throw new StatusError() }

  const [ addedUser ]: UserSignupData[] = await db<User>('users')
    .insert({
      email,
      password: passwordHash,
      userCreatedAt: new Date(),
      roleID: customerRoleID.roleID
    }, [ 'userID', 'email' ])

  if (!addedUser) { throw new StatusError() }

  const token = jwt.sign(
    { userID: addedUser.userID },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  setTokenCookie(res, token, true)
  return addedUser
}

const loginUser = async (userInput: UserLoginInput, res: Response): Promise<UserBaseData> => {
  const { email, password, remember } = userInput

  const existingUser = await db<User>('users')
    .first()
    .where('email', email)

  if (!existingUser) {
    throw new StatusError(401, 'Invalid Email or Password')
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password)

  if (!isPasswordValid) {
    throw new StatusError(401, 'Invalid Email or Password')
  }

  const token = jwt.sign(
    { userID: existingUser.userID },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  setTokenCookie(res, token, remember)

  return R.omit([
    'password',
    'resetToken',
    'resetTokenCreatedAt',
    'isDeleted',
    'roleID'
  ], existingUser)
}

type UserListData = Omit<User,
  | 'password'
  | 'resetToken'
  | 'resetTokenCreatedAt'
  | 'roleID'
> & {
  role: string;
  orderCount: number;
  ratingCount: number;
  questionCount: number;
  answerCount: number;
}

const getUsers = async (): Promise<UserListData[]> => {
  const users: UserListData[] = await db('users as u')
    .select('email', 'u.name', 'info', 'avatar', 'userCreatedAt',
      'isDeleted', 'u.userID', 'rl.name as role')
    .count('o.orderID as orderCount')
    .count('r.ratingID as ratingCount')
    .count('q.questionID as questionCount')
    .count('a.answerID as answerCount')
    .leftJoin('orders as o', 'u.userID', 'o.userID')
    .leftJoin('ratings as r', 'u.userID', 'r.userID')
    .leftJoin('questions as q', 'u.userID', 'q.userID')
    .leftJoin('answers as a', 'u.userID', 'a.userID')
    .leftJoin('roles as rl', 'u.roleID', 'rl.roleID')
    .where('rl.name', '!=', 'ROOT')
    .groupBy('u.userID', 'rl.name')

  if (!users) { throw new StatusError(404, 'Not Found') }
  return users
}

type UserPersonalData = UserBaseData & {
  orders: Order[];
  ratings: Rating[];
  questions: Question[];
  answers: Answer[];
}

type UserPublicData = Omit<UserPersonalData,
  | 'email'
  | 'userCreatedAt'
  | 'orders'
>

const getUserByID = async (userID: number, res: Response): Promise<UserPersonalData | UserPublicData> => {
  const user = await db<User>('users')
    .first()
    .where('userID', userID)

  if (!user) { throw new StatusError(404, 'Not Found') }

  const hasPermission = shield.hasRole([ 'ROOT', 'ADMIN' ], res) ||
  res.locals.userID === userID

  const orders = hasPermission
    ? await db<Order>('orders')
      .where('userID', userID)
    : undefined

  const ratings = await db<Rating>('ratings')
    .where('userID', userID)

  const questions = await db<Question>('questions')
    .where('userID', userID)

  const answers = await db<Answer>('answers')
    .where('userID', userID)

  const userDataSplitted = hasPermission
    ? R.omit([
      'password',
      'resetToken',
      'resetTokenCreatedAt',
      'isDeleted',
      'roleID'
    ], user)
    : R.pick([
      'userID',
      'name',
      'avatar',
      'info'
    ], user)

  return {
    ...userDataSplitted,
    orders,
    ratings,
    questions,
    answers
  }
}

type UserUpdatedData = Pick<User,
  | 'name'
  | 'email'
  | 'avatar'
> & {
  roleID?: number;
}

const updateUser = async (userInput: UserUpdateInput, res: Response, userID: number): Promise<UserUpdatedData> => {
  const role: string | undefined = res.locals.userRole

  const [ updatedUser ] = await db<User>('users')
    .update({ ...userInput },
      [ 'name', 'email', 'avatar', 'roleID' ])
    .where('userID', userID)

  if (!updatedUser) { throw new StatusError(404, 'Not Found') }

  role !== 'ROOT' && delete updatedUser.roleID
  return updatedUser
}

const sendPasswordReset = async (userInput: PasswordRequestInput): Promise<void> => {
  const { email } = userInput

  const user = await db<User>('users')
    .first()
    .where('email', email)

  if (!user) throw new StatusError(401, 'Invalid Email')

  const resetToken = (await promisify(randomBytes)(20)).toString('hex')
  const resetTokenCreatedAt = new Date()

  await db('users')
    .update({ resetToken, resetTokenCreatedAt })
    .where('email', email)

  // try {
  //   await transport.sendMail({
  //     from: 'ecom@example.com',
  //     to: email,
  //     subject: 'Your Password Reset Token',
  //     html: makeANiceEmail(`Your Password Reset Token is Here!
  //         <br/>
  //         <a href='${env.BASE_URL}/reset-password?resetToken=${resetToken}'>
  //           Click Here to Reset
  //         </a>`)
  //   })
  // } catch (_err) {
  //   throw new StatusError(500, 'Error requesting password reset. Please try again later.')
  // }
}

const resetPassword = async ({ password, resetToken }: PasswordResetInput, res: Response): Promise<UserBaseData> => {
  const user = await db<User>('users')
    .first('userID', 'resetTokenCreatedAt')
    .where('resetToken', resetToken)

  if (!user?.resetTokenCreatedAt || Number(user.resetTokenCreatedAt) + 3600000 < Date.now()) {
    throw new StatusError(401, 'Reset token is invalid or expired')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [ updatedUser ] = await db<User>('users')
    .update({
      resetToken: null,
      resetTokenCreatedAt: null,
      password: passwordHash
    },
    [ 'name', 'userID', 'email', 'info', 'avatar', 'userCreatedAt' ])
    .where('userID', user.userID)

  const token = jwt.sign(
    { userID: user.userID },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  setTokenCookie(res, token, true)
  return updatedUser
}

export default {
  addUser,
  loginUser,
  getUsers,
  getUserByID,
  updateUser,
  sendPasswordReset,
  resetPassword
}
