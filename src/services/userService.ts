import { Request } from 'express'
import { omit } from 'ramda'
import { User, UserRoleUpdateInput, UserSafeData, UsersFiltersInput } from '../types'
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
    'u.cover',
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
  questionCount: number;
  answerCount: number;
  reviewCommentCount: number;
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
      reviewCount: parseInt(u.reviewCount),
      reviewCommentCount: parseInt(u.reviewCommentCount),
      questionCount: parseInt(u.questionCount),
      answerCount: parseInt(u.answerCount)
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
      .filter((u) => u.reviewCommentCount + u.questionCount + u.answerCount >= activityCountMin)
  }

  if (activityCountMax !== undefined) {
    users = users
      .filter((u) => u.reviewCommentCount + u.questionCount + u.answerCount <= activityCountMax)
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
  | 'orderCount'
  | 'questionCount'
>

const getUserByID = async (req: Request): Promise<(UserData | UserPublicData) & { followersCount: number }> => {
  const { userID } = req.params

  const rawUser: UserRawData = await getUsersQuery.clone()
    .first()
    .where('u.userID', userID)

  if (rawUser === undefined) { throw new StatusError(404, 'Not Found') }

  const [ { count: followersCount } ] = await db('followers as f')
    .count('f.follows')
    .where('f.follows', userID)

  const [ { count: helpfulVotes } ] = await db('votes as v')
    .count('v.vote')
    .where('v.vote', true)
    .where((builder) => {
      builder
        .where('a.userID', userID)
        .orWhere('q.userID', userID)
        .orWhere('r.userID', userID)
    })
    .leftJoin('answers as a', 'v.answerID', 'a.answerID')
    .leftJoin('questions as q', 'v.questionID', 'q.questionID')
    .leftJoin('reviews as r', 'v.reviewID', 'r.reviewID')

  const user = {
    ...rawUser,
    followersCount: parseInt(followersCount as string ?? '0'),
    reviewCommentCount: parseInt(rawUser.reviewCommentCount ?? '0'),
    questionCount: parseInt(rawUser.questionCount ?? '0'),
    answerCount: parseInt(rawUser.answerCount ?? '0'),
    orderCount: parseInt(rawUser.orderCount ?? '0'),
    reviewCount: parseInt(rawUser.reviewCount ?? '0'),
    helpfulVotes: parseInt(helpfulVotes as string)
  }

  const hasPermission = [ 'ROOT', 'ADMIN' ].includes(req.session?.role) || req.session?.userID === user.userID

  return hasPermission
    ? user
    : omit([
      'email',
      'createdAt',
      'orders',
      'questionCount',
      'orderCount',
      'role'
    ], user)
}

const updateUserRole = async (userInput: UserRoleUpdateInput, req: Request): Promise<UserSafeData> => {
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
    imagesPath: `${imagesBasePath}/images/avatars`,
    maxWidth: 460,
    maxHeight: 460,
    thumbWidth: 48,
    thumbHeight: 48
  }
  uploadImages([ file ], uploadConfig)
}

const uploadUserCover = (file: Express.Multer.File, req: Request): void => {
  const uploadConfig = {
    fileNames: [ req.session?.userID ],
    imagesPath: `${imagesBasePath}/images/covers`,
    maxWidth: 1000,
    maxHeight: 320
  }
  uploadImages([ file ], uploadConfig)
}

export default {
  getUsers,
  getUserByID,
  updateUserRole,
  uploadUserAvatar,
  uploadUserCover
}
