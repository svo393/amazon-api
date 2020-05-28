import { Request } from 'express'
import { Follower } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addFollower = async (req: Request): Promise<Follower> => {
  const { userID, anotherUserID } = req.params

  const existingFollower = await db<Follower>('followers')
    .first()
    .where('userID', userID)
    .andWhere('follows', anotherUserID)

  if (existingFollower) {
    throw new StatusError(409, 'You\'are already following this user')
  }

  const [ addedFollower ]: Follower[] = await db('followers')
    .insert({ userID, follows: anotherUserID }, [ '*' ])

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
  const deleteCount = await db<Follower>('followers')
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
