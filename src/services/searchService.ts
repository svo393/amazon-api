import { Request } from 'express'
import { Answer, AskFiltersInput, Product, Review } from '../types'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import StatusError from '../utils/StatusError'
import R from 'ramda'

type ProductData = Pick<Product, 'groupID' | 'description'>

type AnswerData = Pick<Answer, 'answerID' | 'content'> & { question: number; questionID: number } & Author

type ReviewData = Pick<Review, 'reviewID' | 'content' | 'title'> & Author

type Author = { name: string; userID: number }

type Return = {
  product: ProductData;
  answers: (Omit<AnswerData, 'name' | 'userID'> & { author: Author })[];
  reviews: (Omit<ReviewData, 'name' | 'userID'> & { author: Author })[];
}

const getAsk = async (askFiltersinput: AskFiltersInput, req: Request): Promise<Return> => {
  const { q } = askFiltersinput

  const product = await db<Product>('products')
    .first('groupID', 'description')
    .where('productID', req.params.productID)

  if (product === undefined) throw new StatusError(404, 'Not Found')

  let answers: AnswerData[] = await db('answers as a')
    .select(
      'a.answerID',
      'a.content',
      'q.content as question',
      'q.questionID',
      'u.name',
      'u.userID'
    )
    .join('users as u', 'a.userID', 'u.userID')
    .join('questions as q', 'a.questionID', 'q.questionID')
    .where('q.groupID', product.groupID)

  answers = answers
    .filter((_, i) =>
      fuseIndexes(answers, [ 'content', 'question' ], q).includes(i))

  const _answers = answers.map((a) => ({
    ...R.omit([ 'name', 'userID' ], a),
    author: { name: a.name, userID: a.userID }
  }))

  let reviews: ReviewData[] = await db('reviews as r')
    .select(
      'r.reviewID',
      'r.title',
      'r.content',
      'u.name',
      'u.userID'
    )
    .join('users as u', 'r.userID', 'u.userID')
    .where('r.groupID', product.groupID)

  reviews = reviews
    .filter((_, i) =>
      fuseIndexes(reviews, [ 'content', 'title' ], q).includes(i))

  const _reviews = reviews.map((a) => ({
    ...R.omit([ 'name', 'userID' ], a),
    author: { name: a.name, userID: a.userID }
  }))

  return {
    product,
    answers: _answers,
    reviews: _reviews
  }
}

export default { getAsk }
