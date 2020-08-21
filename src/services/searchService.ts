import { Request } from 'express'
import Fuse from 'fuse.js'
import { flatten, omit } from 'ramda'
import { AskFiltersInput, Matches, ObjIndexed, Product, Question, Review, Vote } from '../types'
import { db } from '../utils/db'
import fuseMatches from '../utils/fuseMatches'
import StatusError from '../utils/StatusError'

type ProductData = Pick<Product, 'groupID' | 'bullets'>

type QuestionData = Pick<Question, 'questionID' | 'content'> & { answerContent: string; answerID: number; createdAt: string } & Author

type ReviewData = Pick<Review, 'reviewID' | 'content' | 'title' | 'stars'> & Author

type Author = { name: string; userID: number }
type AnswerData = { answerID: number; content: string; createdAt: string }

type QuestionItem = (Omit<QuestionData, 'name' | 'userID' | 'answerContent' | 'answerID' | 'createdAt'> & {
  votes: number;
  matches: Matches;
  answers: (AnswerData & { author: Author; votes: number; matches: Matches })[];
})

type Return = {
  product?: ProductData & { matches: Matches };
  questions: (Omit<QuestionItem, 'answers'> & { answer: (AnswerData & { author: Author; votes: number; matches: Matches }) })[];
  reviews: (Omit<ReviewData, 'name' | 'userID'> & { author: Author; votes: number; matches: Matches })[];
}

const getAsk = async (askFiltersinput: AskFiltersInput, req: Request): Promise<Return> => {
  const { q } = askFiltersinput

  const product = await db<Product>('products')
    .first('groupID', 'bullets', 'productID')
    .where('productID', req.params.productID)

  if (product === undefined) throw new StatusError(404, 'Not Found')

  const productMatches = fuseMatches([ product ], [ 'bullets' ], q, 'productID')[product.productID]

  let _questions: QuestionData[] = await db('questions as q')
    .select(
      'q.questionID',
      'q.content',
      'a.content as answerContent',
      'a.answerID',
      'a.createdAt',
      'u.name',
      'u.userID'
    )
    .join('answers as a', 'q.questionID', 'a.questionID')
    .join('users as u', 'a.userID', 'u.userID')
    .where('q.groupID', product.groupID)

  const questionMatches = fuseMatches(_questions, [ 'content' ], q, 'questionID')

  const answerMatches = fuseMatches(_questions, [ 'answerContent' ], q, 'answerID')

  let questions: QuestionItem[] = Object.values(_questions
    .reduce((acc, cur) => {
      const answer = {
        answerID: cur.answerID,
        content: cur.answerContent,
        createdAt: cur.createdAt,
        author: { name: cur.name, userID: cur.userID },
        matches: cur.answerID in answerMatches
          ? answerMatches[cur.answerID].map((m) => ({
            ...m, key: m.key === 'answerContent' ? 'content' : m.key
          }))
          : undefined
      }

      if (!(cur.questionID in acc)) {
        acc[cur.questionID] = {
          ...cur,
          matches: questionMatches[cur.questionID],
          answers: [ answer ]
        }
      } else { acc[cur.questionID].answers.push(answer) }
      return acc
    }, {} as ObjIndexed))

  let _reviews: ReviewData[] = await db('reviews as r')
    .select(
      'r.reviewID',
      'r.stars',
      'r.title',
      'r.content',
      'u.name',
      'u.userID'
    )
    .join('users as u', 'r.userID', 'u.userID')
    .where('r.groupID', product.groupID)

  const reviewMatches = fuseMatches(_reviews, [ 'content', 'title' ], q, 'reviewID')

  const reviews = _reviews
    .map((r) => ({
      ...omit([ 'name', 'userID' ], r),
      author: { name: r.name, userID: r.userID },
      matches: reviewMatches[r.reviewID]
    }))
    .filter((r) => r.matches !== undefined)

  const reviewIDs = reviews.map((r) => r.reviewID)
  const questionIDs = questions.map((q) => q.questionID)
  const answerIDs = flatten(questions.map((q) => q.answers.map((a) => a.answerID)))

  const votes = await db<Vote>('votes')
    .whereIn('answerID', answerIDs)
    .orWhereIn('questionID', questionIDs)
    .orWhereIn('reviewID', reviewIDs)

  return {
    product: productMatches
      ? { ...product, matches: productMatches }
      : undefined,

    questions: questions.map((q) => {
      const voteSum = votes
        .filter((v) => v.questionID === q.questionID)
        .reduce((acc, cur) => (
          acc += cur.vote ? 1 : -1
        ), 0)
      return {
        ...omit([ 'name', 'userID', 'answerContent', 'answers', 'answerID', 'createdAt' ], q),
        votes: voteSum,
        answer: q.answers
          .map((a) => {
            const voteSum = votes
              .filter((v) => v.answerID === a.answerID)
              .reduce((acc, cur) => (
                acc += cur.vote ? 1 : -1
              ), 0)
            return { ...a, votes: voteSum }
          }).sort((a, b) => b.votes - a.votes)[0]
      }
    })
      .sort((a, b) => b.votes - a.votes)
      .filter((q) =>
        q.answer.matches !== undefined || q.matches !== undefined
      ),

    reviews: reviews
      .map((r) => {
        const voteSum = votes
          .filter((v) => v.reviewID === r.reviewID)
          .reduce((acc, cur) => (
            acc += cur.vote ? 1 : -1
          ), 0)
        return { ...r, votes: voteSum }
      }).sort((a, b) => b.votes - a.votes)
  }
}

export default { getAsk }
