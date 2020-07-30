import { Request, Response } from 'express'
import R from 'ramda'
import { User, UserSafeData, UsersFiltersInput, UserUpdateInput } from '../types'
import { defaultLimit, imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import { uploadImages } from '../utils/img'
import sortElements from '../utils/sortElements'
import StatusError from '../utils/StatusError'

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

const getUsers = async (usersFiltersinput: UsersFiltersInput): Promise<{ batch: UserData[]; totalCount: number }> => {
  const {
    page = 0,
    sortBy,
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

  const usersSorted = sortElements(users, sortBy)

  return {
    batch: usersSorted.slice(page * defaultLimit, page * defaultLimit + defaultLimit),
    totalCount: usersSorted.length
  }
}

type UserPublicData = Omit<UserData,
  | 'email'
  | 'createdAt'
  | 'orders'
  | 'role'
>

const getUserByID = async (req: Request): Promise<UserData | UserPublicData> => {
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

  const hasPermission = [ 'ROOT', 'ADMIN' ].includes(req.session?.role)

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
  const role: string | undefined = req.session?.role

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

const uploadUserAvatar = (file: Express.Multer.File, req: Request): void => {
  const uploadConfig = {
    fileNames: [ req.session?.userID ],
    imagesPath: `${imagesBasePath}/avatars`,
    maxWidth: 460,
    maxHeight: 460,
    thumbWidth: 48,
    thumbHeight: 48
  }
  uploadImages([ file ], uploadConfig)
}

export default {
  getUsers,
  getUserByID,
  updateUser,
  uploadUserAvatar
}
