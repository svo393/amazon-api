import { Request } from 'express'
import { Follower, User } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addFollower = async (req: Request): Promise<Follower> => {
  const { rows: [ addedFollower ] }: { rows: Follower[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('followers').insert({
      userID: req.params.userID,
      follows: req.params.anotherUserID
    }) ]
  )

  if (addedFollower === undefined) {
    throw new StatusError(409, 'You\'are already following this user')
  }
  return addedFollower
}

const getFollowersByUser = async (req: Request): Promise<Follower[]> => {
  return await db('followers')
    .where('follows', req.params.userID)
}

const getFollowedByUser = async (req: Request): Promise<{ userID: number; follows: Pick<User, 'userID' | 'avatar' | 'name'>[] }> => {
  const { userID } = req.params

  const users: Pick<User, 'userID' | 'avatar' | 'name'>[] = await db('followers as f')
    .select(
      'u.userID',
      'u.avatar',
      'u.name'
    )
    .where('f.userID', userID)
    .join('users as u', 'f.follows', 'u.userID')

  return { userID: Number(userID), follows: users }
}

const deleteFollower = async (req: Request): Promise<void> => {
  const deleteCount = await db('followers')
    .del()
    .where('userID', req.params.userID)
    .andWhere('follows', req.params.anotherUserID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addFollower,
  getFollowersByUser,
  getFollowedByUser,
  deleteFollower
}
