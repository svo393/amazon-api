import { Follower, FollowerFetchInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addFollower = async (followerInput: Follower): Promise<Follower> => {
  const { userID, follows } = followerInput

  const existingFollower = await db<Follower>('followers')
    .first()
    .where('userID', userID)
    .andWhere('follows', follows)

  let addedFollower

  if (!existingFollower) {
    [ addedFollower ] = await db('followers')
      .insert(followerInput, [ '*' ])
  }

  return existingFollower ?? addedFollower
}

const getFollowers = async (followerInput: FollowerFetchInput): Promise<Follower[] | void> => {
  const { userID, follows } = followerInput

  if (follows) {
    return await db('followers')
      .where('follows', follows)
  }

  if (userID) {
    return await db('followers')
      .where('userID', userID)
  }
}

const deleteFollower = async (userID: number, follows: number): Promise<void> => {
  const deleteCount = await db<Follower>('followers')
    .del()
    .where('userID', userID)
    .andWhere('follows', follows)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addFollower,
  getFollowers,
  deleteFollower
}
