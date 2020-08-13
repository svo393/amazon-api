import { Request } from 'express'
import R from 'ramda'
import { AskFiltersInput, ObjIndexed, Product, Question, Review } from '../types'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import StatusError from '../utils/StatusError'

type ProductData = Pick<Product, 'groupID' | 'description'>

type QuestionData = Pick<Question, 'questionID' | 'content'> & { answer: string; answerID: number } & Author

type ReviewData = Pick<Review, 'reviewID' | 'content' | 'title'> & Author

type Author = { name: string; userID: number }
type AnswerData = { answerID: number; content: string }

type Questions = (Omit<QuestionData, 'name' | 'userID' | 'answer' | 'answerID'> & { answers: (AnswerData & { author: Author })[] })[]

type Return = {
  product: ProductData;
  questions: Questions;
  reviews: (Omit<ReviewData, 'name' | 'userID'> & { author: Author })[];
}

const getAsk = async (askFiltersinput: AskFiltersInput, req: Request): Promise<Return> => {
  const { q } = askFiltersinput

  const product = await db<Product>('products')
    .first('groupID', 'description', 'productID')
    .where('productID', req.params.productID)

  if (product === undefined) throw new StatusError(404, 'Not Found')

  let _questions: QuestionData[] = await db('questions as q')
    .select(
      'q.questionID',
      'q.content',
      'a.content as answer',
      'a.answerID',
      'u.name',
      'u.userID'
    )
    .join('answers as a', 'q.questionID', 'a.questionID')
    .join('users as u', 'a.userID', 'u.userID')
    .where('q.groupID', product.groupID)

  const questions: Questions = Object.values(_questions
    .filter((_, i) =>
      fuseIndexes(_questions, [ 'content', 'answer' ], q).includes(i))
    .reduce((acc, cur) => {
      const answer = {
        answerID: cur.answerID,
        content: cur.answer,
        author: { name: cur.name, userID: cur.userID }
      }

      if (!(cur.questionID in acc)) {
        acc[cur.questionID] = { ...cur, answers: [ answer ] }
      } else { acc[cur.questionID].answers.push(answer) }
      return acc
    }, {} as ObjIndexed))
  console.info('_questions', _questions)

  // TODO add votes

  let _reviews: ReviewData[] = await db('reviews as r')
    .select(
      'r.reviewID',
      'r.title',
      'r.content',
      'u.name',
      'u.userID'
    )
    .join('users as u', 'r.userID', 'u.userID')
    .where('r.groupID', product.groupID)

  _reviews = _reviews
    .filter((_, i) =>
      fuseIndexes(_reviews, [ 'content', 'title' ], q).includes(i))

  const reviews = _reviews.map((a) => ({
    ...R.omit([ 'name', 'userID' ], a),
    author: { name: a.name, userID: a.userID }
  }))

  return {
    product,
    questions: questions.map((q) => ({
      ...R.omit([ 'name', 'userID', 'answer', 'answerID' ], q)
    })),
    reviews
  }
}

export default { getAsk }
