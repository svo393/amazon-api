import { Request } from 'express'
import { omit } from 'ramda'
import { Answer, Feed, FeedFiltersInput, GroupVariation, Question, Review, ReviewComment, UserFeed, UserFeedFiltersInput, Product, Image, User } from '../types'
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
    types = 'review,answer,reviewComment'
  } = feedFiltersinput

  let reviews: Review[] = []

  let reviewComments: (ReviewComment & {
    review:
      Pick<Review, 'title' | 'stars' | 'reviewID'>
      & { author: Pick<User, 'userID' | 'name'> };
 })[] = []
  let answers: (Answer & { question: { questionID: number; content: string; author: { name: string; userID: number } } })[] = []

  const _types = types.split(',')

  if (_types.includes('review')) {
    let _reviews = await db<Review & { productID?: number }>('reviews')
      .where('userID', userID)
      .andWhere('moderationStatus', 'APPROVED')

    const groupIDs = _reviews.map((r) => r.groupID)

    const groupVariations = await db<GroupVariation>('groupVariations')
      .whereIn('groupID', groupIDs)

    _reviews = _reviews.map((r) => {
      const [ name, value ] = Object.entries(r.variation)[0]

      const productID = groupVariations
        .find((gv) => gv.name === name && gv.value === value)?.productID as number

      return { ...r, productID }
    })

    const productIDs = _reviews.map((r) => r.productID as number)

    let products: (Product & { stars: string | number })[] = await db('products as p')
      .select(
        'p.productID',
        'p.title',
        'p.groupID'
      )
      .avg('stars as stars')
      .whereIn('p.productID', productIDs)
      .leftJoin('reviews as r', 'p.groupID', 'r.groupID')
      .groupBy('p.productID')

    products = await Promise.all(products.map(async (p) => {
      const [ { reviewCount } ] = await db('reviews')
        .count('reviewID as reviewCount')
        .where('moderationStatus', 'APPROVED')
        .andWhere('groupID', p.groupID)

      return {
        ...p,
        stars: parseFloat(p.stars as string),
        reviewCount: parseInt(reviewCount as string)
      }
    }))

    const images = await db<Image>('images')
      .whereIn('productID', productIDs)
      .andWhere('index', 0)

    reviews = _reviews.map((r) => {
      const image = images.find((i) => i.productID === r.productID)
      const product = products.find((p) => p.productID === r.productID)

      delete r.productID

      return {
        ...r,
        images: [ image ],
        product,
        author: { userID: r.userID }
      }
    })
  }

  if (_types.includes('answer')) {
    let _answers: (Answer & { questionContent: string; userName: string })[] = await db('answers as a')
      .select(
        'a.questionID',
        'a.answerID',
        'a.content',
        'a.createdAt',
        'q.content as questionContent',
        'q.userID',
        'u.name as userName'
      )
      .where('a.userID', userID)
      .andWhere('a.moderationStatus', 'APPROVED')
      .leftJoin('questions as q', 'a.questionID', 'q.questionID')
      .leftJoin('users as u', 'a.userID', 'u.userID')

    answers = _answers.map((a) => ({
      ...omit([ 'questionContent', 'userName' ], a),
      question: {
        questionID: a.questionID,
        content: a.questionContent,
        author: {
          name: a.userName,
          userID: a.userID
        }
      }
    }))
  }

  if (_types.includes('reviewComment')) {
    let _reviewComments: (ReviewComment & { title: string; stars: number; userName: string })[] = await db('reviewComments as rc')
      .select(
        'rc.reviewCommentID',
        'rc.reviewID',
        'rc.content',
        'rc.createdAt',
        'r.title',
        'r.stars',
        'r.userID',
        'u.name as userName'
      )
      .where('rc.userID', userID)
      .andWhere('rc.moderationStatus', 'APPROVED')
      .leftJoin('reviews as r', 'rc.reviewID', 'r.reviewID')
      .leftJoin('users as u', 'r.userID', 'u.userID')

    reviewComments = _reviewComments.map((rc) => ({
      ...omit([ 'title', 'stars', 'userName' ], rc),
      review: {
        title: rc.title,
        stars: rc.stars,
        reviewID: rc.reviewID,
        author: {
          name: rc.userName,
          userID: rc.userID
        }
      }
    }))
  }

  let feed: UserFeed = [
    ...reviewComments.map((rc) => ({ ...rc, type: 'reviewComment' })),
    ...reviews.map((r) => ({ ...r, type: 'review' })),
    ...answers.map((a) => ({ ...a, type: 'answer' }))
  ]

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
