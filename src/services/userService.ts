import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { CookieOptions, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import R from 'ramda'
import { promisify } from 'util'
import { Answer, AnswerComment, Order, PasswordRequestInput, PasswordResetInput, Question, Rating, RatingComment, User, UserLoginInput, UserSafeData, UsersFiltersInput, UserSignupInput, UserUpdateInput } from '../types'
import env from '../utils/config'
import { imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'
// import { makeANiceEmail, transport } from '../utils/mail'

type UserBaseData = Omit<UserSafeData,
  | 'role'
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

const loginUser = async (userInput: UserLoginInput, res: Response): Promise<UserBaseData> => {
  const { email, password, remember } = userInput

  const existingUser = await db<User>('users')
    .first()
    .where('email', email)

  if (existingUser === undefined) {
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
    'resetTokenCreatedAt'
  ], existingUser)
}

type UserTempData = Omit<User,
  | 'password'
  | 'resetToken'
  | 'resetTokenCreatedAt'
> & {
  orderCount: number;
  ratingCount: number;
  ratingCommentCount: number;
  questionCount: number;
  answerCount: number;
  answerCommentCount: number;
}

type UserListData = Omit<UserTempData,
  | 'ratingCommentCount'
  | 'questionCount'
  | 'answerCount'
  | 'answerCommentCount'
> & {
  activitiesCount: number;
}

const getUsers = async (userFilterInput: UsersFiltersInput): Promise<UserListData[]> => {
  const {
    roles,
    createdFrom,
    createdTo,
    orderCountMin,
    orderCountMax,
    ratingCountMin,
    ratingCountMax,
    activitiesCountMin,
    activitiesCountMax,
    email
  } = userFilterInput

  let rawUsers: UserTempData[] = await db('users as u')
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

  let users = rawUsers.map((u) => ({
    ...R.omit([
      'ratingCommentCount',
      'questionCount',
      'answerCount',
      'answerCommentCount'
    ], u),
    activitiesCount: Number(u.ratingCommentCount) + Number(u.questionCount) + Number(u.answerCount) + Number(u.answerCommentCount)
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

  if (activitiesCountMin !== undefined) {
    users = users
      .filter((u) => u.activitiesCount >= activitiesCountMin)
  }

  if (activitiesCountMax !== undefined) {
    users = users
      .filter((u) => u.activitiesCount <= activitiesCountMax)
  }

  if (email !== undefined) {
    users = users
      .filter((u) => u.email?.toLowerCase().includes(email.toLowerCase()))
  }

  if (users === undefined) { throw new StatusError(404, 'Not Found') }
  return users
}

type UserPersonalData = UserSafeData & {
  orders: Order[];
  ratings: Rating[];
  ratingComments: RatingComment[];
  questions: Question[];
  answers: Answer[];
  answerComments: AnswerComment[];
}

type UserPublicData = Omit<UserPersonalData,
  | 'email'
  | 'createdAt'
  | 'orders'
  | 'role'
>

const getUserByID = async (req: Request, res: Response): Promise<UserPersonalData | UserPublicData> => {
  const userID = req.params.userID ?? res.locals.userID

  const user = await db<User>('users')
    .first()
    .where('userID', userID)

  if (user === undefined) { throw new StatusError(404, 'Not Found') }

  const hasPermission = [ 'ROOT', 'ADMIN' ].includes(res.locals.userRole) ||
  res.locals.userID === userID

  const orders = hasPermission
    ? await db<Order>('orders')
      .where('userID', userID)
    : undefined

  const ratings = await db<Rating>('ratings')
    .where('userID', userID)

  const ratingComments = await db<RatingComment>('ratingComments')
    .where('userID', userID)

  const questions = await db<Question>('questions')
    .where('userID', userID)

  const answers = await db<Answer>('answers')
    .where('userID', userID)

  const answerComments = await db<AnswerComment>('answerComments')
    .where('userID', userID)

  const userDataSplitted = hasPermission
    ? R.omit([
      'password',
      'resetToken',
      'resetTokenCreatedAt'
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
    ratingComments,
    ratings,
    questions,
    answers,
    answerComments
  }
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
  if (res.locals.userRole === 'ROOT') {
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

const uploadUserAvatar = (file: Express.Multer.File, req: Request): void => {
  const uploadConfig = {
    imagesPath: `${imagesBasePath}/avatars`,
    maxWidth: 460,
    maxHeight: 460,
    thumbWidth: 48,
    thumbHeight: 48
  }
  uploadImages([ file ], req, uploadConfig)
}

export default {
  addUser,
  loginUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
  sendPasswordReset,
  resetPassword,
  uploadUserAvatar
}
