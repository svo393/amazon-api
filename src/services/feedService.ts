import R from 'ramda'
import { Answer, AnswerComment, FeedFiltersInput, ObjIndexed, Question, RatingComment } from '../types'
import { db } from '../utils/db'

interface Feed extends ObjIndexed {
  ratingComments?: (RatingComment & { type: string })[];
  questions?: (Question & { type: string })[];
  answers?: (Answer & { type: string })[];
  answerComments?: (AnswerComment & { type: string })[];
}

type Activity =
  RatingComment & { type: string } |
  Question & { type: string } |
  Answer & { type: string } |
  AnswerComment & { type: string }

const getFeed = async (feedFilterInput: FeedFiltersInput): Promise<Feed> => {
  const {
    types,
    moderationStatuses,
    createdFrom,
    createdTo,
    content,
    userEmail
  } = feedFilterInput

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

  let feed: Feed = {
    ratingComments: [ ...ratingComments.map((x) => ({ ...x, type: 'ratingComment' })) ],
    questions: [ ...questions.map((x) => ({ ...x, type: 'question' })) ],
    answers: [ ...answers.map((x) => ({ ...x, type: 'answer' })) ],
    answerComments: [ ...answerComments.map((x) => ({ ...x, type: 'answerComment' })) ]
  }

  if (types !== undefined) {
    feed = R.pick(types.split(',').map((a) => a + 's'), feed)
  }

  if (moderationStatuses !== undefined) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        moderationStatuses.split(',').includes(a.moderationStatus))
      if (feed[activity].length === 0) delete feed[activity]
    }
  }

  if (createdFrom !== undefined) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        a.createdAt >= new Date(createdFrom))
      if (feed[activity].length === 0) delete feed[activity]
    }
  }

  // TODO misses today in filter
  if (createdTo !== undefined) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        a.createdAt <= new Date(createdTo))
      if (feed[activity].length === 0) delete feed[activity]
    }
  }

  if (content !== undefined) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        a.content.toLowerCase().includes(content.toLowerCase()))
      if (feed[activity].length === 0) delete feed[activity]
    }
  }

  if (userEmail !== undefined) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        a.userEmail.toLowerCase().includes(userEmail.toLowerCase()))
      if (feed[activity].length === 0) delete feed[activity]
    }
  }

  return feed
}

export default {
  getFeed
}
