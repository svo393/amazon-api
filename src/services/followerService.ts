import { Request } from 'express'
import { Follower } from '../types'
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

const getFollowedByUser = async (req: Request): Promise<Follower[]> => {
  return await db('followers')
    .where('userID', req.params.userID)
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
