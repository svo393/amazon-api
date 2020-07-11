import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { CookieOptions, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import R from 'ramda'
import { promisify } from 'util'
import { PasswordRequestInput, PasswordResetInput, User, UserLoginInput, UserSafeData, UsersFiltersInput, UserSignupInput, UserUpdateInput } from '../types'
import env from '../utils/config'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'
// import { makeANiceEmail, transport } from '../utils/mail'

const getUsersQuery: any = db('users as u')
  .select('email',
    'u.name',
    'info',
    'avatar',
    'u.createdAt',
    'u.userID',
    'role'
  )
  .count('o.orderID as orderCount')
  .count('r.ratingID as ratingCount')
  .count('rc.ratingCommentID as ratingCommentCount')
  .count('q.questionID as questionCount')
  .count('a.answerID as answerCount')
  .count('ac.answerID as answerCommentCount')
  .leftJoin('orders as o', 'u.userID', 'o.userID')
  .leftJoin('ratings as r', 'u.userID', 'r.userID')
  .leftJoin('ratingComments as rc', 'u.userID', 'rc.userID')
  .leftJoin('questions as q', 'u.userID', 'q.userID')
  .leftJoin('answers as a', 'u.userID', 'a.userID')
  .leftJoin('answerComments as ac', 'u.userID', 'ac.userID')
  .where('role', '!=', 'ROOT')
  .groupBy('u.userID')

type UserBaseData = Omit<UserSafeData, | 'role'>

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

  if (existingUser !== undefined) {
    throw new StatusError(409, `User with email '${email}' already exists`)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [ addedUser ]: UserSignupData[] = await db('users')
    .insert({
      email,
      password: passwordHash,
      createdAt: new Date(),
      role: 'CUSTOMER'
    }, [ 'userID', 'email' ])

  if (addedUser === undefined) { throw new StatusError() }

  const token = jwt.sign(
    { userID: addedUser.userID },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  setTokenCookie(res, token, true)
  return addedUser
}

const loginUser = async (userInput: UserLoginInput, res: Response, requiresAdmin = false): Promise<UserBaseData> => {
  const { email, password, remember } = userInput

  const existingUser = await db<User>('users')
    .first()
    .where('email', email)

  if (existingUser === undefined) {
    throw new StatusError(401, 'Invalid Email or Password')
  }

  if (requiresAdmin && ![ 'ADMIN', 'ROOT' ].includes(existingUser.role)) {
    throw new StatusError(403, 'Forbidden')
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
    'resetTokenCreatedAt'
  ], existingUser)
}

type UserRawData = Omit<User,
  | 'password'
  | 'resetToken'
  | 'resetTokenCreatedAt'
> & {
  orderCount: string;
  ratingCount: string;
  ratingCommentCount: string;
  questionCount: string;
  answerCount: string;
  answerCommentCount: string;
}

type UserData = Omit<UserRawData,
  | 'orderCount'
  | 'ratingCount'
  | 'ratingCommentCount'
  | 'questionCount'
  | 'answerCount'
  | 'answerCommentCount'
> & {
  activityCount: number;
  orderCount: number;
  ratingCount: number;
}

const getUsers = async (usersFiltersinput: UsersFiltersInput): Promise<UserData[]> => {
  const {
    roles,
    createdFrom,
    createdTo,
    orderCountMin,
    orderCountMax,
    ratingCountMin,
    ratingCountMax,
    activityCountMin,
    activityCountMax,
    email
  } = usersFiltersinput

  const rawUsers: UserRawData[] = await getUsersQuery.clone()

  let users = rawUsers
    .map((u) => ({
      ...u,
      orderCount: parseInt(u.orderCount),
      ratingCount: parseInt(u.ratingCount)
    }))
    .map((u) => ({
      ...R.omit([
        'ratingCommentCount',
        'questionCount',
        'answerCount',
        'answerCommentCount'
      ], u),
      activityCount: [
        parseInt(u.ratingCommentCount),
        parseInt(u.questionCount),
        parseInt(u.answerCount),
        parseInt(u.answerCommentCount)
      ].reduce((acc, cur) => acc + cur, 0)
    }))

  if (roles !== undefined) {
    users = users
      .filter((u) => roles.split(',').includes(u.role))
  }

  if (createdFrom !== undefined) {
    users = users
      .filter((u) => u.createdAt >= new Date(createdFrom))
  }

  if (createdTo !== undefined) {
    users = users
      .filter((u) => u.createdAt <= new Date(createdTo))
  }

  if (orderCountMin !== undefined) {
    users = users
      .filter((u) => u.orderCount >= orderCountMin)
  }

  if (orderCountMax !== undefined) {
    users = users
      .filter((u) => u.orderCount <= orderCountMax)
  }

  if (ratingCountMin !== undefined) {
    users = users
      .filter((u) => u.ratingCount >= ratingCountMin)
  }

  if (ratingCountMax !== undefined) {
    users = users
      .filter((u) => u.ratingCount <= ratingCountMax)
  }

  if (activityCountMin !== undefined) {
    users = users
      .filter((u) => u.activityCount >= activityCountMin)
  }

  if (activityCountMax !== undefined) {
    users = users
      .filter((u) => u.activityCount <= activityCountMax)
  }

  if (email !== undefined) {
    users = users
      .filter((u) => u.email?.toLowerCase().includes(email.toLowerCase()))
  }

  if (users === undefined) { throw new StatusError(404, 'Not Found') }
  return users
}

type UserPublicData = Omit<UserData,
  | 'email'
  | 'createdAt'
  | 'orders'
  | 'role'
>

type CurrentUser = { userID: number; role: string }

const getMe = async (res: Response): Promise<CurrentUser> => {
  const user = await db<User>('users')
    .where('userID', res.locals.userID)
    .first('userID', 'role')

  if (user === undefined) { throw new StatusError(404, 'Not Found') }
  return user
}

const getUserByID = async (req: Request, res: Response): Promise<UserData | UserPublicData> => {
  const rawUser: UserRawData = await getUsersQuery.clone()
    .first()
    .where('u.userID', req.params.userID)

  if (rawUser === undefined) { throw new StatusError(404, 'Not Found') }

  const user = {
    ...R.omit([
      'ratingCommentCount',
      'questionCount',
      'answerCount',
      'answerCommentCount'
    ], rawUser),
    activityCount: [
      parseInt(rawUser.ratingCommentCount),
      parseInt(rawUser.questionCount),
      parseInt(rawUser.answerCount),
      parseInt(rawUser.answerCommentCount)
    ].reduce((acc, cur) => acc + cur, 0),
    orderCount: parseInt(rawUser.orderCount),
    ratingCount: parseInt(rawUser.ratingCount)
  }

  const hasPermission = [ 'ROOT', 'ADMIN' ].includes(res.locals.userRole)

  return hasPermission
    ? user
    : R.omit([
      'email',
      'createdAt',
      'orders',
      'role'
    ], user)
}

const updateUser = async (userInput: UserUpdateInput, res: Response, req: Request): Promise<UserSafeData> => {
  const role: string | undefined = res.locals.userRole

  const [ updatedUser ]: User[] = await db('users')
    .update(userInput, [ '*' ])
    .where('userID', req.params.userID)

  if (updatedUser === undefined) { throw new StatusError(404, 'Not Found') }

  role !== 'ROOT' && delete updatedUser.role
  return R.omit([
    'password',
    'resetToken',
    'resetTokenCreatedAt'
  ], updatedUser)
}

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  if ([ 'ROOT', 'ADMIN' ].includes(res.locals.userRole)) {
    throw new StatusError(451, 'Not gonna happen')
  }

  const deleteCount = await db('users')
    .del()
    .where('userID', req.params.userID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

const sendPasswordReset = async (userInput: PasswordRequestInput): Promise<void> => {
  const { email } = userInput

  const user = await db<User>('users')
    .first()
    .where('email', email)

  if (user === undefined) throw new StatusError(401, 'Invalid Email')

  const resetToken = (await promisify(randomBytes)(20)).toString('hex')
  const resetTokenCreatedAt = new Date()

  await db('users')
    .update({ resetToken, resetTokenCreatedAt })
    .where('email', email)

  // try { // TODO
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

  if (user?.resetTokenCreatedAt === undefined || Number(user.resetTokenCreatedAt) + 3600000 < Date.now()) {
    throw new StatusError(401, 'Reset token is invalid or expired')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [ updatedUser ] = await db<User>('users')
    .update({
      resetToken: null,
      resetTokenCreatedAt: null,
      password: passwordHash
    },
    [ 'name', 'userID', 'email', 'info', 'avatar', 'createdAt', 'role' ])
    .where('userID', user.userID)

  const token = jwt.sign(
    { userID: user.userID },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  setTokenCookie(res, token, true)
  return updatedUser
}

const uploadUserAvatar = (file: Express.Multer.File, res: Response): void => {
  const uploadConfig = {
    fileNames: [ res.locals.userID ],
    imagesPath: `${imagesBasePath}/avatars`,
    maxWidth: 460,
    maxHeight: 460,
    thumbWidth: 48,
    thumbHeight: 48
  }
  uploadImages([ file ], uploadConfig)
}

export default {
  addUser,
  loginUser,
  getUsers,
  getMe,
  getUserByID,
  updateUser,
  deleteUser,
  sendPasswordReset,
  resetPassword,
  uploadUserAvatar
}
