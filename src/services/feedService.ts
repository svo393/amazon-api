import { Answer, AnswerComment, FeedFiltersInput, Question, RatingComment } from '../types'
import { defaultLimit } from '../utils/constants'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import sortItems from '../utils/sortItems'

type Activity = (
  RatingComment |
  Question |
  Answer |
  AnswerComment
) & { type: string }

type Feed = Activity[]

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

  const ratingComments = await db<RatingComment>('ratingComments as rc')
    .select(
      'rc.ratingCommentID',
      'rc.createdAt',
      'rc.updatedAt',
      'rc.content',
      'rc.moderationStatus',
      'rc.userID',
      'rc.ratingID',
      'rc.parentRatingCommentID',
      'u.email as userEmail'
    )
    .join('users as u', 'rc.userID', 'u.userID')
    .groupBy('rc.ratingCommentID', 'userEmail')

  const questions = await db<Question>('questions as q')
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

  const answers = await db<Answer>('answers as a')
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

  const answerComments = await db<AnswerComment>('answerComments as ac')
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
    ...ratingComments.map((rc) => ({ ...rc, type: 'ratingComment' })),
    ...questions.map((q) => ({ ...q, type: 'question' })),
    ...answers.map((a) => ({ ...a, type: 'answer' })),
    ...answerComments.map((ac) => ({ ...ac, type: 'answerComment' }))
  ]

  if (q !== undefined) {
    feed = feed
      .filter((_, i) =>
        fuseIndexes(feed, [ 'content' ], q).includes(i))
  }

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

  const feedSorted = sortItems(feed, sortBy)

  return {
    batch: feedSorted.slice((page - 1) * defaultLimit, (page - 1) * defaultLimit + defaultLimit),
    totalCount: feed.length
  }
}

export default { getFeed }
