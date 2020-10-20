import { Request } from 'express'
import Knex from 'knex'
import { BatchWithCursor, CursorInput, Follower, User } from '../types'
import { db, dbTrans } from '../utils/db'
import getCursor from '../utils/getCursor'
import sortItems from '../utils/sortItems'
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

const getFollowedByUser = async (cursorInput: Pick<CursorInput, 'startCursor'> & { limit?: number }, req: Request): Promise<{ userID: number; follows: BatchWithCursor<Pick<User, 'userID' | 'avatar' | 'name'>> }> => {
  const { startCursor, limit } = cursorInput
  const { userID } = req.params

  let users: Pick<User, 'userID' | 'avatar' | 'name'>[] = await db('followers as f')
    .select(
      'u.userID',
      'u.avatar',
      'f.follows',
      'u.name'
    )
    .where('f.userID', userID)
    .join('users as u', 'f.follows', 'u.userID')

  users = sortItems(users, 'name')

  return {
    userID: Number(userID),
    follows: getCursor({
      startCursor,
      limit: limit ?? 2,
      idProp: 'follows',
      data: users
    })
  }
}

const deleteFollower = async (req: Request): Promise<Follower> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const follower = await trx<Follower>('followers')
      .first()
      .where('userID', req.params.userID)
      .andWhere('follows', req.params.anotherUserID)

    const deleteCount = await trx('followers')
      .del()
      .where('userID', req.params.userID)
      .andWhere('follows', req.params.anotherUserID)

    if (deleteCount === 0) throw new StatusError(404, 'Not Found')

    return follower
  })
}

export default {
  addFollower,
  getFollowersByUser,
  getFollowedByUser,
  deleteFollower
}
