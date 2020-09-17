import { Request } from 'express'
import { Answer, Feed, FeedFiltersInput, Question, Review, ReviewComment, UserFeed, UserFeedFiltersInput } from '../types'
import { defaultLimit } from '../utils/constants'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import getCursor from '../utils/getCursor'
import sortItems from '../utils/sortItems'

const getFeed = async (feedFiltersinput: FeedFiltersInput): Promise<{ batch: Feed; totalCount: number }> => {
  const {
    page = 1,
    sortBy = 'createdAt_desc',
    q,
    types,
    moderationStatuses,
    createdFrom,
    createdTo,
    userEmail
  } = feedFiltersinput

  const reviewComments: (ReviewComment & { userEmail: string })[] = await db('reviewComments as rc')
    .select(
      'rc.reviewCommentID',
      'rc.createdAt',
      'rc.updatedAt',
      'rc.content',
      'rc.moderationStatus',
      'rc.userID',
      'rc.reviewID',
      'rc.parentReviewCommentID',
      'u.email as userEmail'
    )
    .join('users as u', 'rc.userID', 'u.userID')
    .groupBy('rc.reviewCommentID', 'userEmail')

  const questions: (Question & { userEmail: string })[] = await db('questions as q')
    .select(
      'q.questionID',
      'q.createdAt',
      'q.updatedAt',
      'q.content',
      'q.moderationStatus',
      'q.userID',
      'q.groupID',
      'u.email as userEmail'
    )
    .join('users as u', 'q.userID', 'u.userID')
    .groupBy('q.questionID', 'userEmail')

  const answers: (Answer & { userEmail: string })[] = await db('answers as a')
    .select(
      'a.answerID',
      'a.createdAt',
      'a.updatedAt',
      'a.content',
      'a.moderationStatus',
      'a.userID',
      'a.questionID',
      'u.email as userEmail'
    )
    .join('users as u', 'a.userID', 'u.userID')
    .groupBy('a.answerID', 'userEmail')

  let feed: Feed = [
    ...reviewComments.map((rc) => ({ ...rc, type: 'reviewComment' })),
    ...questions.map((q) => ({ ...q, type: 'question' })),
    ...answers.map((a) => ({ ...a, type: 'answer' }))
  ]

  if (types !== undefined) {
    feed = feed
      .filter((a) => types.split(',').includes(a.type))
  }

  if (moderationStatuses !== undefined) {
    feed = feed
      .filter((a) =>
        moderationStatuses.split(',').includes(a.moderationStatus))
  }

  if (createdFrom !== undefined) {
    feed = feed
      .filter((a) =>
        a.createdAt >= new Date(createdFrom))
  }

  // TODO misses today in filter
  if (createdTo !== undefined) {
    feed = feed
      .filter((a) =>
        a.createdAt <= new Date(createdTo))
  }

  if (userEmail !== undefined) {
    feed = feed
      .filter((a) =>
        a.userEmail.toLowerCase().includes(userEmail.toLowerCase()))
  }

  if (q !== undefined) {
    feed = feed
      .filter((_, i) =>
        fuseIndexes(feed, [ 'content' ], q).includes(i))
  }

  const feedSorted = sortItems(feed, sortBy)

  return {
    batch: feedSorted.slice((page - 1) * defaultLimit, (page - 1) * defaultLimit + defaultLimit),
    totalCount: feed.length
  }
}

const getUserFeed = async (feedFiltersinput: UserFeedFiltersInput, req: Request): Promise<{ batch: UserFeed; totalCount: number }> => {
  const { userID } = req.params

  const {
    startCursor,
    startCursorType,
    types
  } = feedFiltersinput

  const reviews: Review[] = await db('reviews')
    .where('userID', userID)
    .andWhere('moderationStatus', 'APPROVED')

  const groupIDs = reviews.map((r) => r.groupID)

  const groupVariations = await db('groupVariations')
    .whereIn('groupID', groupIDs)

  console.info('groupVariations', groupVariations)

  // groupVariationElements
  // .map(([ name, product ]) => [ name, Object.entries(product)
  //   .reduce((acc, [ id, value ]) => {
  //     const curVariations = groupVariationElements
  //       .reduce((acc, [ name, variations ]) => {
  //         acc[name] = variations[Number(id)]
  //         return acc
  //       }, {} as ObjIndexed)

  const reviewComments: ReviewComment[] = await db('reviewComments')
    .where('userID', userID)
    .andWhere('moderationStatus', 'APPROVED')

  const answers: Answer[] = await db('answers')
    .where('userID', userID)
    .andWhere('moderationStatus', 'APPROVED')

  let feed: UserFeed = [
    ...reviewComments.map((rc) => ({ ...rc, type: 'reviewComment' })),
    ...reviews.map((r) => ({ ...r, type: 'review' })),
    ...answers.map((a) => ({ ...a, type: 'answer' }))
  ]

  if (types !== undefined) {
    feed = feed
      .filter((a) => types.split(',').includes(a.type))
  }

  const feedSorted = sortItems(feed, 'createdAt_desc')

  return getCursor({
    startCursor,
    startCursorType,
    limit: 10,
    idTypes: [ 'answer', 'reviewComment', 'review' ],
    data: feedSorted
  })
}

export default {
  getFeed,
  getUserFeed
}
