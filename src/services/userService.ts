import { Request, Response } from 'express'
import { omit } from 'ramda'
import { User, UserSafeData, UsersFiltersInput, UserUpdateInput } from '../types'
import { defaultLimit, imagesBasePath } from '../utils/constants'
import { db } from '../utils/db'
import { uploadImages } from '../utils/img'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const getUsersQuery: any = db('users as u')
  .distinct()
  .select(
    'u.email',
    'u.name',
    'u.info',
    'u.avatar',
    'u.createdAt',
    'u.userID',
    'u.role'
  )
  .count('o.orderID as orderCount')
  .count('r.reviewID as reviewCount')
  .count('rc.reviewCommentID as reviewCommentCount')
  .count('q.questionID as questionCount')
  .count('a.answerID as answerCount')
  .leftJoin('orders as o', 'u.userID', 'o.userID')
  .leftJoin('reviews as r', 'u.userID', 'r.userID')
  .leftJoin('reviewComments as rc', 'u.userID', 'rc.userID')
  .leftJoin('questions as q', 'u.userID', 'q.userID')
  .leftJoin('answers as a', 'u.userID', 'a.userID')
  .where('u.role', '!=', 'ROOT')
  .groupBy(
    'u.userID',
    'o.orderID',
    'r.reviewID',
    'rc.reviewCommentID',
    'q.questionID',
    'a.answerID'
  )

type UserRawData = Omit<User,
  | 'password'
  | 'resetToken'
  | 'resetTokenCreatedAt'
> & {
  orderCount: string;
  reviewCount: string;
  reviewCommentCount: string;
  questionCount: string;
  answerCount: string;
}

type UserData = Omit<UserRawData,
  | 'orderCount'
  | 'reviewCount'
  | 'reviewCommentCount'
  | 'questionCount'
  | 'answerCount'
> & {
  activityCount: number;
  orderCount: number;
  reviewCount: number;
}

const getUsers = async (usersFiltersinput: UsersFiltersInput): Promise<{ batch: UserData[]; totalCount: number }> => {
  const {
    page = 1,
    sortBy = 'email',
    roles,
    createdFrom,
    createdTo,
    orderCountMin,
    orderCountMax,
    reviewCountMin,
    reviewCountMax,
    activityCountMin,
    activityCountMax,
    email
  } = usersFiltersinput

  const rawUsers: UserRawData[] = await getUsersQuery.clone()

  let users = rawUsers
    .map((u) => ({
      ...u,
      orderCount: parseInt(u.orderCount),
      reviewCount: parseInt(u.reviewCount)
    }))
    .map((u) => ({
      ...omit([
        'reviewCommentCount',
        'questionCount',
        'answerCount'
      ], u),
      activityCount: [
        parseInt(u.reviewCommentCount),
        parseInt(u.questionCount),
        parseInt(u.answerCount)
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

  if (reviewCountMin !== undefined) {
    users = users
      .filter((u) => u.reviewCount >= reviewCountMin)
  }

  if (reviewCountMax !== undefined) {
    users = users
      .filter((u) => u.reviewCount <= reviewCountMax)
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

  const usersSorted = sortItems(users, sortBy)

  return {
    batch: usersSorted.slice((page - 1) * defaultLimit, (page - 1) * defaultLimit + defaultLimit),
    totalCount: users.length
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
    ...omit([
      'reviewCommentCount',
      'questionCount',
      'answerCount'
    ], rawUser),
    activityCount: [
      parseInt(rawUser.reviewCommentCount),
      parseInt(rawUser.questionCount),
      parseInt(rawUser.answerCount)
    ].reduce((acc, cur) => acc + cur, 0),
    orderCount: parseInt(rawUser.orderCount),
    reviewCount: parseInt(rawUser.reviewCount)
  }

  const hasPermission = [ 'ROOT', 'ADMIN' ].includes(req.session?.role)

  return hasPermission
    ? user
    : omit([
      'email',
      'createdAt',
      'orders',
      'role'
    ], user)
}

const updateUser = async (userInput: UserUpdateInput, res: Response, req: Request): Promise<UserSafeData> => {
  const [ updatedUser ]: User[] = await db('users')
    .update(userInput, [ '*' ])
    .where('userID', req.params.userID)

  if (updatedUser === undefined) { throw new StatusError(404, 'Not Found') }

  return omit([
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
