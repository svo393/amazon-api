import { Request } from 'express'
import R from 'ramda'
import { Answer, AnswerComment, Question, RatingComment } from '../types'
import { db } from '../utils/db'

type Feed = (RatingComment | Question | Answer | AnswerComment)[]

const getFeed = async ({ query: queryArgs }: Request): Promise<Feed> => {
  const ratingComments = await db<RatingComment>('ratingComments')
  const questions = await db<Question>('questions')
  const answers = await db<Answer>('answers')
  const answerComments = await db<AnswerComment>('answerComments')

  let feed = [
    ...ratingComments,
    ...questions,
    ...answers,
    ...answerComments
  ]

  if ('activities' in queryArgs && !R.isEmpty(queryArgs.activities)) {
    feed = feed.filter((a) =>
      Object.keys(a).some((k) =>
        queryArgs.activities.toString().split(',').includes(k))
    )
  }
  return feed
}

export default {
  getFeed
}
