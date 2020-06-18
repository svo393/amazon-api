import { Request } from 'express'
import R from 'ramda'
import { Answer, AnswerComment, ObjIndexed, Question, RatingComment } from '../types'
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

const getFeed = async ({ query: queryArgs }: Request): Promise<Feed> => {
  const ratingComments = await db<RatingComment>('ratingComments as rc')
    .select(
      'rc.ratingCommentID',
      'rc.createdAt',
      'rc.updatedAt',
      'rc.content',
      'rc.media',
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
      'q.media',
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
      'a.media',
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
      'ac.media',
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

  if ('types' in queryArgs && !R.isEmpty(queryArgs.types)) {
    feed = R.pick(queryArgs.types.toString().split(',').map((a) => a + 's'), feed)
  }

  if ('moderationStatuses' in queryArgs && !R.isEmpty(queryArgs.moderationStatuses)) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        queryArgs.moderationStatuses.toString().split(',').includes(a.moderationStatus))
      if (R.isEmpty(feed[activity])) delete feed[activity]
    }
  }

  if ('createdFrom' in queryArgs && !R.isEmpty(queryArgs.createdFrom)) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        a.createdAt >= new Date(queryArgs.createdFrom.toString()))
      if (R.isEmpty(feed[activity])) delete feed[activity]
    }
  }

  // TODO misses today in filter
  if ('createdTo' in queryArgs && !R.isEmpty(queryArgs.createdTo)) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        a.createdAt <= new Date(queryArgs.createdTo.toString()))
      if (R.isEmpty(feed[activity])) delete feed[activity]
    }
  }

  if ('content' in queryArgs && !R.isEmpty(queryArgs.content)) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        a.content.includes(queryArgs.content.toString()))
      if (R.isEmpty(feed[activity])) delete feed[activity]
    }
  }

  if ('userEmail' in queryArgs && !R.isEmpty(queryArgs.userEmail)) {
    for (const activity in feed) {
      feed[activity] = feed[activity].filter((a: Activity) =>
        a.userEmail.includes(queryArgs.userEmail.toString()))
      if (R.isEmpty(feed[activity])) delete feed[activity]
    }
  }

  return feed
}

export default {
  getFeed
}
