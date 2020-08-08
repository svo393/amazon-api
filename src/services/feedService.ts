import { Answer, AnswerComment, Feed, FeedFiltersInput, Question, ReviewComment } from '../types'
import { defaultLimit } from '../utils/constants'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
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

  const answerComments: (AnswerComment & { userEmail: string })[] = await db('answerComments as ac')
    .select(
      'ac.answerCommentID',
      'ac.createdAt',
      'ac.updatedAt',
      'ac.content',
      'ac.moderationStatus',
      'ac.userID',
      'ac.parentAnswerCommentID',
      'u.email as userEmail'
    )
    .join('users as u', 'ac.userID', 'u.userID')
    .groupBy('ac.answerCommentID', 'userEmail')

  let feed: Feed = [
    ...reviewComments.map((rc) => ({ ...rc, type: 'reviewComment' })),
    ...answerComments.map((ac) => ({ ...ac, type: 'answerComment' })),
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

export default { getFeed }
