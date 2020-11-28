import { Request } from 'express'
import { flatten, isEmpty, omit, sum } from 'ramda'
import {
  AskFiltersInput,
  BatchWithCursor,
  GroupVariation,
  Image,
  Matches,
  ObjIndexed,
  Product,
  ProductSize,
  Question,
  Review,
  SearchFiltersInput,
  Vote
} from '../types'
import {
  colorList,
  parametersBL,
  sizeList,
  sizeMap
} from '../utils/constants'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import fuseMatches from '../utils/fuseMatches'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'
import { getProductsQuery } from './productService'

type ProductData = Pick<Product, 'groupID' | 'bullets'>
type Author = { name: string; userID: number }

type QuestionData = Pick<Question, 'questionID' | 'content'> & {
  answerContent: string
  answerID: number
  createdAt: string
} & Author

type ReviewData = Pick<
  Review,
  'reviewID' | 'content' | 'title' | 'stars'
> &
  Author

type AnswerData = {
  answerID: number
  content: string
  createdAt: string
}

type QuestionItem = Omit<
  QuestionData,
  'name' | 'userID' | 'answerContent' | 'answerID' | 'createdAt'
> & {
  votes: number
  matches: Matches
  answers: (AnswerData & {
    author: Author
    votes: number
    matches: Matches
  })[]
}

type AskReturn = {
  product?: ProductData & { matches: Matches }
  questions: (Omit<QuestionItem, 'answers'> & {
    answer: AnswerData & {
      author: Author
      votes: number
      matches: Matches
    }
  })[]
  reviews: (Omit<ReviewData, 'name' | 'userID'> & {
    author: Author
    votes: number
    matches: Matches
  })[]
}

const getAsk = async (
  askFiltersinput: AskFiltersInput,
  req: Request
): Promise<AskReturn> => {
  const { q } = askFiltersinput

  const product = await db<Product>('products')
    .first('groupID', 'bullets', 'productID')
    .where('productID', req.params.productID)

  if (product === undefined) throw new StatusError(404, 'Not Found')

  const productMatches = fuseMatches(
    [product],
    ['bullets'],
    q,
    'productID'
  )[product.productID]

  const _questions: QuestionData[] = await db('questions as q')
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
    .andWhere('q.moderationStatus', 'APPROVED')
    .andWhere('a.moderationStatus', 'APPROVED')

  const questionMatches = fuseMatches(
    _questions,
    ['content'],
    q,
    'questionID'
  )
  const answerMatches = fuseMatches(
    _questions,
    ['answerContent'],
    q,
    'answerID'
  )

  const questions: QuestionItem[] = Object.values(
    _questions.reduce((acc, cur) => {
      const answer = {
        answerID: cur.answerID,
        content: cur.answerContent,
        createdAt: cur.createdAt,
        author: { name: cur.name, userID: cur.userID },
        matches:
          cur.answerID in answerMatches
            ? answerMatches[cur.answerID].map((m) => ({
                ...m,
                key: m.key === 'answerContent' ? 'content' : m.key
              }))
            : undefined
      }

      if (!(cur.questionID in acc)) {
        acc[cur.questionID] = {
          ...cur,
          matches: questionMatches[cur.questionID],
          answers: [answer]
        }
      } else {
        acc[cur.questionID].answers.push(answer)
      }
      return acc
    }, {} as ObjIndexed)
  )

  const _reviews: ReviewData[] = await db('reviews as r')
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
    .andWhere('r.moderationStatus', 'APPROVED')

  const reviewMatches = fuseMatches(
    _reviews,
    ['content', 'title'],
    q,
    'reviewID'
  )

  const reviews = _reviews
    .map((r) => ({
      ...omit(['name', 'userID'], r),
      author: { name: r.name, userID: r.userID },
      matches: reviewMatches[r.reviewID]
    }))
    .filter((r) => r.matches !== undefined)

  const reviewIDs = reviews.map((r) => r.reviewID)
  const questionIDs = questions.map((q) => q.questionID)
  const answerIDs = flatten(
    questions.map((q) => q.answers.map((a) => a.answerID))
  )

  const votes = await db<Vote>('votes')
    .whereIn('answerID', answerIDs)
    .orWhereIn('questionID', questionIDs)
    .orWhereIn('reviewID', reviewIDs)

  return {
    product: productMatches
      ? { ...product, matches: productMatches }
      : undefined,

    questions: questions
      .map((q) => {
        const voteSum = votes.filter(
          (v) => v.questionID === q.questionID
        ).length
        return {
          ...omit(
            [
              'name',
              'userID',
              'answerContent',
              'answers',
              'answerID',
              'createdAt'
            ],
            q
          ),
          votes: voteSum,
          answer: q.answers
            .map((a) => {
              const voteSum = votes
                .filter((v) => v.answerID === a.answerID)
                .reduce((acc, cur) => (acc += cur.vote ? 1 : -1), 0)
              return { ...a, votes: voteSum }
            })
            .sort((a, b) => b.votes - a.votes)[0]
        }
      })
      .sort((a, b) => b.votes - a.votes)
      .filter(
        (q) =>
          q.answer.matches !== undefined || q.matches !== undefined
      ),

    reviews: reviews
      .map((r) => {
        const voteSum = votes
          .filter((v) => v.reviewID === r.reviewID)
          .reduce((acc, cur) => (acc += cur.vote ? 1 : -1), 0)
        return { ...r, votes: voteSum }
      })
      .sort((a, b) => b.votes - a.votes)
  }
}

type ProductSearchData = Pick<
  Product,
  | 'title'
  | 'groupID'
  | 'bullets'
  | 'productID'
  | 'price'
  | 'listPrice'
  | 'description'
  | 'stock'
  | 'isAvailable'
  | 'categoryID'
  | 'vendorID'
> & {
  vendorName: string
  categoryName: string
  stars: string | number
  productSizesSum: number | null
}

type ProductSearchReturn = Omit<ProductSearchData, 'stars'> & {
  stars: number | string
  reviewCount: number
  images: Omit<Image, 'userID'>[]
  productSizesSum: number | null
}

type Caterogy = [number, string, number]
type Vendor = [number, string, number]

const getSearch = async (
  searchFiltersinput: SearchFiltersInput
): Promise<BatchWithCursor<ProductSearchReturn> & {
  categories: Caterogy[]
  vendors: Vendor[]
  prices: number[]
  ratings: number[]
  filters: { [k: string]: string[] }
}> => {
  const {
    page = 1,
    q,
    sortBy = 'createdAt_desc',
    outOfStock = false,
    categoryID,
    vendorIDs,
    colors,
    sizes,
    priceMin,
    priceMax,
    starsMin,
    ...restFilters
  } = searchFiltersinput

  let _products: ProductSearchData[] = await getProductsQuery
    .clone()
    .select('p.bullets', 'p.description', 'p.listPrice')

  _products = _products.map((p) => ({
    ...p,
    stars: parseFloat(p.stars as string),
    price: p.price / 100,
    listPrice: p.listPrice !== null ? p.listPrice / 100 : null
  }))

  let products = _products

  if (categoryID !== undefined) {
    products = products.filter((p) => p.categoryID === categoryID)
  }

  if (q !== undefined) {
    products = products.filter((_, i) =>
      fuseIndexes(
        products,
        ['title', 'bullets', 'description'],
        q
      ).includes(i)
    )
  }

  if (priceMin !== undefined) {
    products = products.filter((p) => p.price >= priceMin)
  }

  if (priceMax !== undefined) {
    products = products.filter((p) => p.price <= priceMax)
  }

  if (starsMin !== undefined) {
    products = products.filter((p) => p.stars >= starsMin)
  }

  const productSizes = await db<ProductSize>('productSizes')
    .whereIn(
      'productID',
      products.map(({ productID }) => productID)
    )
    .andWhereNot('qty', 0)

  products = products.map((p) => {
    const sizesSum = sum(
      productSizes
        .filter((ps) => ps.productID === p.productID)
        .map(({ qty }) => qty)
    )

    return { ...p, productSizesSum: sizesSum || null }
  })

  if (outOfStock === false) {
    products = products.filter((p) => p.stock || p.productSizesSum)
  }

  const productIDs = products.map((p) => p.productID)

  let productParameters = await db('productParameters as pp')
    .join('parameters as p', 'pp.parameterID', 'p.parameterID')
    .whereIn('pp.productID', productIDs)
    .whereNotIn('name', parametersBL)

  productParameters = productParameters.filter(
    (pp) => !pp.value.includes('#')
  )

  const groupVariations = await db<GroupVariation>('groupVariations')
    .where('name', 'Color')
    .whereIn('productID', productIDs)

  if (colors !== undefined) {
    const productsWithColors = groupVariations
      .filter((gv) =>
        colors.some((c) => gv.value.toLowerCase().includes(c))
      )
      .map((gv) => gv.productID)
    products = products.filter((p) =>
      productsWithColors.includes(p.productID)
    )
  }

  if (sizes !== undefined) {
    const reversedSizeMap = Object.entries(sizeMap).reduce(
      (acc, cur) => {
        if (acc[cur[1]] === undefined) {
          acc[cur[1]] = [cur[0]]
        } else {
          acc[cur[1]].push(cur[0])
        }
        return acc
      },
      {} as ObjIndexed
    )

    const productsWithSizes = productSizes
      .filter(
        (ps) =>
          sizes
            .map((s) => s.toLowerCase())
            .includes(ps.name.toLowerCase()) ||
          sizes.some((s) =>
            reversedSizeMap[s]?.includes(ps.name.toLowerCase())
          )
      )
      .map((ps) => ps.productID)
    products = products.filter((p) =>
      productsWithSizes.includes(p.productID)
    )
  }

  const categories = products.reduce((acc, cur) => {
    if (acc[cur.categoryID] === undefined) {
      acc[cur.categoryID] = [cur.categoryID, cur.categoryName, 1]
    } else {
      acc[cur.categoryID][2] += 1
    }
    return acc
  }, {} as ObjIndexed)

  const vendors = _products.reduce((acc, cur) => {
    const isPresent = Boolean(
      products.find((p) => p.productID === cur.productID)
    )

    if (acc[cur.vendorID] === undefined) {
      acc[cur.vendorID] = [
        cur.vendorID,
        cur.vendorName,
        isPresent ? 1 : 0
      ]
    } else {
      acc[cur.vendorID][2] += isPresent ? 1 : 0
    }
    return acc
  }, {} as ObjIndexed)

  if (vendorIDs !== undefined) {
    products = products.filter((p) => vendorIDs.includes(p.vendorID))
  }

  const ratings = products.reduce(
    (acc, cur) => {
      switch (true) {
        case cur.stars >= 4:
          acc[0] += 1
          break

        case cur.stars >= 3:
          acc[1] += 1
          break

        case cur.stars >= 2:
          acc[2] += 1
          break

        default:
          acc[3] += 1
      }
      return acc
    },
    [0, 0, 0, 0]
  )

  const prices = products.reduce(
    (acc, cur) => {
      switch (true) {
        case cur.price <= 25:
          acc[0] += 1
          break

        case cur.price > 25 && cur.price <= 50:
          acc[1] += 1
          break

        case cur.price > 50 && cur.price <= 100:
          acc[2] += 1
          break

        case cur.price > 100 && cur.price <= 200:
          acc[3] += 1
          break

        default:
          acc[4] += 1
      }
      return acc
    },
    [0, 0, 0, 0, 0]
  )

  const _productParameters: typeof productParameters = []

  if (!isEmpty(restFilters)) {
    Object.entries(restFilters).forEach(([name, values]) => {
      _productParameters.push(
        productParameters.filter(
          (pp) =>
            pp.name === name && values.split(',').includes(pp.value)
        )
      )
    })

    products = products.filter((p) =>
      _productParameters.every((i) =>
        i.some((pp: any) => pp.productID === p.productID)
      )
    )
  }

  const totalCount = products.length
  const end = (page - 1) * 5 + 5

  const productsSorted = sortItems(products, sortBy)
  const batch = productsSorted.slice((page - 1) * 5, end)

  const images = await db<Image>('images')
    .whereIn(
      'productID',
      batch.map(({ productID }) => productID)
    )
    .andWhere('index', 0)

  const _batch = await Promise.all(
    batch.map(async (p) => {
      const reviews: any = await db('reviews')
        .count('reviewID')
        .where('moderationStatus', 'APPROVED')
        .andWhere('groupID', p.groupID)

      const ratingStats = await db('reviews')
        .select('stars')
        .count('stars')
        .where('groupID', p.groupID)
        .andWhere('moderationStatus', 'APPROVED')
        .groupBy('stars')

      const image = images.find((i) => i.productID === p.productID)

      return {
        ...p,
        reviewCount: parseInt(reviews[0].count),
        ratingStats: ratingStats.reduce((acc, cur) => {
          acc[cur.stars] = Number(cur.count)
          return acc
        }, {} as { [k: number]: number }),
        images:
          image !== undefined
            ? [
                {
                  imageID: image.imageID,
                  index: 0,
                  productID: p.productID
                }
              ]
            : []
      }
    })
  )

  const newProductParameters = !isEmpty(restFilters)
    ? flatten(_productParameters)
    : productParameters

  const filters: { [k: string]: Set<string> } = newProductParameters
    .filter((pp) =>
      products.map((p) => p.productID).includes(pp.productID)
    )
    .reduce((acc, cur) => {
      if (acc[cur.name] === undefined) {
        acc[cur.name] = new Set([cur.value])
      } else {
        acc[cur.name].add(cur.value)
      }
      return acc
    }, {} as ObjIndexed)

  filters.Colors = new Set(groupVariations.map((gv) => gv.value))

  filters.Sizes = new Set(
    productSizes
      .filter((ps) =>
        products.map((p) => p.productID).includes(ps.productID)
      )
      .map((ps) => ps.name)
  )

  const colorFilters = colorList.filter((c) =>
    [...filters.Colors].some((i) => i.toLowerCase().includes(c))
  )

  const sizeFilters = sizeList
    .filter((s) =>
      [...filters.Sizes].some(
        (i) =>
          i.toLowerCase() === s.toLowerCase() ||
          sizeMap[i.toLowerCase()] === s
      )
    )
    .concat(
      [...filters.Sizes]
        .filter(
          (s) =>
            sizeMap[s.toLowerCase()] === undefined &&
            !sizeList.includes(s.toUpperCase())
        )
        .sort((a, b) => Number(a) - Number(b))
    )

  const _filters = {
    ...Object.entries(filters)
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 13)
      .reduce((acc, [k, v]) => {
        acc[k] = [...v]
        return acc
      }, {} as { [k: string]: string[] }),
    Colors: colorFilters,
    Sizes: sizeFilters
  }

  return {
    batch: _batch,
    totalCount,
    hasNextPage: end < totalCount,
    categories: Object.values(categories),
    vendors: Object.values(vendors)
      .filter((v) => v[2] !== 0)
      .sort((a, b) => b[2] - a[2]),
    prices,
    ratings,
    filters: _filters
  }
}

export default {
  getAsk,
  getSearch
}
