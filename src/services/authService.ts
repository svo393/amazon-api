import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { Request } from 'express'
import { omit } from 'ramda'
import { promisify } from 'util'
import { PasswordRequestInput, PasswordResetInput, User, UserLoginInput, UserSafeData, UserSignupInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'
// import { makeANiceEmail, transport } from '../utils/mail'

type UserBaseData = Omit<UserSafeData, | 'role'>

const signupUser = async (userInput: UserSignupInput, req: Request): Promise<UserBaseData> => {
  const { email, password } = userInput

  const existingUser = await db<User>('users')
    .first('userID')
    .where('email', email)

  if (existingUser !== undefined) {
    throw new StatusError(409, `User with email '${email}' already exists`)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [ addedUser ]: User[] = await db<User>('users')
    .insert({
      email,
      password: passwordHash,
      createdAt: new Date(),
      role: 'CUSTOMER'
    }, [ '*' ])

  if (addedUser === undefined) { throw new StatusError() }

  if (req.session !== undefined) {
    req.session.userID = addedUser.userID
    req.session.role = addedUser.role
  }
  return omit([
    'password',
    'resetToken',
    'resetTokenCreatedAt'
  ], addedUser)
}

const loginUser = async (userInput: UserLoginInput, req: Request, requiresAdmin = false): Promise<UserBaseData> => {
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

  if (req.session !== undefined) {
    req.session.userID = existingUser.userID
    req.session.role = existingUser.role
  }

  return omit([
    'password',
    'resetToken',
    'resetTokenCreatedAt'
  ], existingUser)
}

type UserInfo = { userID: number; role: string; avatar: boolean; name: string }

const checkInUser = async (req: Request): Promise<UserInfo> => {
  const user = await db<User>('users')
    .where('userID', req.session?.userID)
    .first('userID', 'role', 'avatar', 'name')

  if (user === undefined) { throw new StatusError(401, 'Unauthorized') }
  return user
}

const deleteUser = async (req: Request): Promise<void> => {
  if ([ 'ROOT', 'ADMIN' ].includes(req.session?.role)) {
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
  // } catch (_) {
  //   throw new StatusError(500, 'Error requesting password reset. Please try again later.')
  // }
}

const resetPassword = async ({ password, resetToken }: PasswordResetInput): Promise<UserBaseData> => {
  const user = await db<User>('users')
    .first('userID', 'resetTokenCreatedAt')
    .where('resetToken', resetToken)

  if (user?.resetTokenCreatedAt === undefined || Number(user.resetTokenCreatedAt) + 3600000 < Date.now()) {
    throw new StatusError(401, 'Reset token is invalid or expired')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [ updatedUser ]: User[] = await db<User>('users')
    .update({
      resetToken: null,
      resetTokenCreatedAt: null,
      password: passwordHash
    }, [ '*' ])
    .where('userID', user.userID)

  return omit([
    'password',
    'resetToken',
    'resetTokenCreatedAt'
  ], updatedUser)
}

export default {
  signupUser,
  loginUser,
  checkInUser,
  deleteUser,
  sendPasswordReset,
  resetPassword
}
