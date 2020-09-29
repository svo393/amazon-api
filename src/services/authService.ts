import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { Request } from 'express'
import { omit } from 'ramda'
import { promisify } from 'util'
import { Follower, PasswordRequestInput, PasswordResetInput, User, UserLoginInput, UserPasswordUpdateInput, UserSafeData, UserSignupInput, UserUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'
// import { makeANiceEmail, transport } from '../utils/mail'

type UserBaseData = Omit<UserSafeData, | 'role'> & { following: number[] }

const signupUser = async (userInput: UserSignupInput, req: Request): Promise<UserBaseData> => {
  const { email, password, name } = userInput

  const existingUser = await db<User>('users')
    .first('userID')
    .where('email', email)

  if (existingUser !== undefined) {
    throw new StatusError(409, `User with email '${email}' already exists`)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [ addedUser ]: User[] = await db<User>('users')
    .insert({
      name,
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
  return {
    ...omit([
      'password',
      'resetToken',
      'resetTokenCreatedAt'
    ], addedUser),
    following: []
  }
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

  const users: Pick<Follower, 'follows'>[] = await db('followers')
    .select('follows')
    .where('userID', existingUser.userID)

  const isPasswordValid = await bcrypt.compare(password, existingUser.password)

  if (!isPasswordValid) {
    throw new StatusError(401, 'Invalid Email or Password')
  }

  if (req.session !== undefined) {
    req.session.userID = existingUser.userID
    req.session.role = existingUser.role
  }

  return {
    ...omit([
      'password',
      'resetToken',
      'resetTokenCreatedAt'
    ], existingUser),
    following: users.map((u) => u.follows)
  }
}

type UserInfo = Pick<User, 'userID' | 'role' | 'avatar' | 'name' | 'cover'> & { following: number[] }

const checkInUser = async (req: Request): Promise<Partial<UserInfo> & { countryFromIP: string }> => {
  if (req.session?.userID === undefined) {
    return { countryFromIP: 'anywhere*' }
  }

  const user = await db<User>('users')
    .where('userID', req.session?.userID)
    .first('userID', 'role', 'avatar', 'name', 'cover')

  if (user === undefined) return { countryFromIP: 'anywhere*' }

  const users: Pick<Follower, 'follows'>[] = await db('followers')
    .select('follows')
    .where('userID', user.userID)

  return {
    ...user,
    following: users.map((u) => u.follows),
    countryFromIP: 'anywhere*' // TODO implement country check
  }
}

const updateProfile = async (userInput: UserUpdateInput, req: Request): Promise<Omit<UserInfo, 'following'>> => {
  const [ updatedUser ]: Pick<User, 'userID' | 'role' | 'avatar' | 'name' | 'cover' | 'info'>[] = await db('users')
    .update(userInput, [ 'userID', 'role', 'avatar', 'name', 'cover', 'info' ])
    .where('userID', req.params.userID)

  if (updatedUser === undefined) { throw new StatusError(404, 'Not Found') }

  return updatedUser
}

const updatePassword = async (userInput: UserPasswordUpdateInput, req: Request): Promise<Omit<UserInfo, 'following' | 'cover' | 'role'>> => {
  const { curPassword, newPassword } = userInput

  const user = await db<User>('users')
    .first()
    .where('userID', req.session?.userID)

  if (user === undefined) { throw new StatusError(404, 'Not Found') }

  const isPasswordValid = await bcrypt.compare(curPassword, user.password)
  if (!isPasswordValid) { throw new StatusError(401, 'Invalid Password') }

  const passwordHash = await bcrypt.hash(newPassword, 10)

  const [ updatedUser ]: Pick<User, 'userID' | 'avatar' | 'name' | 'info'>[] = await db('users')
    .update({ password: passwordHash }, [ 'userID', 'avatar', 'name', 'info' ])
    .where('userID', req.params.userID)

  if (updatedUser === undefined) { throw new StatusError() }

  return updatedUser
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

const resetPassword = async ({ password, resetToken }: PasswordResetInput): Promise<Omit<UserBaseData, 'following'>> => {
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
  updateProfile,
  updatePassword,
  deleteUser,
  sendPasswordReset,
  resetPassword
}
