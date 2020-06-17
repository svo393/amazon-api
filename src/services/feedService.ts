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
  const ratingComments = await db<RatingComment>('ratingComments')
  const questions = await db<Question>('questions')
  const answers = await db<Answer>('answers')
  const answerComments = await db<AnswerComment>('answerComments')

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

  return feed
}

export default {
  getFeed
}
