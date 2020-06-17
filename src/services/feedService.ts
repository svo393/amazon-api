import { Request } from 'express'
import R from 'ramda'
import { Answer, AnswerComment, Question, RatingComment } from '../types'
import { db } from '../utils/db'

type Feed = {
  ratingComments: RatingComment[];
  questions: Question[];
  answers: Answer[];
  answerComments: AnswerComment[];
}

const getFeed = async ({ query: queryArgs }: Request): Promise<Feed> => {
  const ratingComments = await db<RatingComment>('ratingComments')
  const questions = await db<Question>('questions')
  const answers = await db<Answer>('answers')
  const answerComments = await db<AnswerComment>('answerComments')

  let feed = {
    ratingComments: [ ...ratingComments.map((x) => ({ ...x, type: 'ratingComment' })) ],
    questions: [ ...questions.map((x) => ({ ...x, type: 'question' })) ],
    answers: [ ...answers.map((x) => ({ ...x, type: 'answer' })) ],
    answerComments: [ ...answerComments.map((x) => ({ ...x, type: 'answerComment' })) ]
  }

  if ('types' in queryArgs && !R.isEmpty(queryArgs.types)) {
    feed = R.pick(queryArgs.types.toString().split(',').map((a) => a + 's'), feed)
  }
  return feed
}

export default {
  getFeed
}
