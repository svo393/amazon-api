import { Request } from 'express'
import { Product, Vote, VotesFiltersInput, VotesCreateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addVote = async (voteInput: VotesCreateInput, req: Request): Promise<Vote> => {
  const { ratingID, questionID, answerID } = req.params

  const { rows: [ addedVote ] }: { rows: Vote[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('votes').insert({
      ...voteInput,
      userID: req.session?.userID,
      ratingID,
      questionID,
      answerID
    }) ]
  )

  if (addedVote === undefined) {
    throw new StatusError(409, 'You\'ve already voted')
  }
  return addedVote
}

const getVotes = async (votesFiltersinput: VotesFiltersInput): Promise<Vote[]> => {
  const {
    ratingID,
    questionID,
    answerID,
    userID
  } = votesFiltersinput

  let votes = await db<Vote>('votes')

  if (ratingID !== undefined) {
    votes = votes
      .filter((i) => i.ratingID === ratingID)
  }

  if (questionID !== undefined) {
    votes = votes
      .filter((i) => i.questionID === questionID)
  }

  if (answerID !== undefined) {
    votes = votes
      .filter((i) => i.answerID === answerID)
  }

  if (userID !== undefined) {
    votes = votes
      .filter((i) => i.userID === userID)
  }

  return votes
}

const getVotesByGroup = async (req: Request): Promise<Vote[]> => {
  const products = await db<Product>('products')
    .select('productID')
    .where('groupID', req.params.groupID)

  return await db('votes')
    .whereIn('productID', products.map((p) => p.productID))
}

export default {
  addVote,
  getVotes,
  getVotesByGroup
}
