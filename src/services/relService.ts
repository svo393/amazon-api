import { Request } from 'express'
import { flatten, omit } from 'ramda'
import { Image, ObjIndexed, Product } from '../types'
import { db } from '../utils/db'

const getRelsQuery: any = db('products as p')
  .avg('stars as stars')
  .count('r.reviewID as reviewCount')
  .andWhere('r.moderationStatus', 'APPROVED')
  .leftJoin('products as ps', 'p.categoryID', 'ps.categoryID')
  .leftJoin('reviews as r', 'ps.groupID', 'r.groupID')
  .orderByRaw('random()')
  .groupBy('ps.title', 'ps.price', 'ps.productID')

type ProductRelData = Pick<Product, 'title' | 'price' | 'productID'> & {
  stars: number;
  images: Image[];
  reviewCount: number
}

const getSimilar = async (req: Request): Promise<ProductRelData | Record<string, unknown>> => {
  const product: Pick<Product, 'title' | 'price' | 'productID'> & { stars: string; reviewCount: string } = await getRelsQuery.clone()
    .first('ps.title', 'ps.price', 'ps.productID')
    .where('p.productID', req.params.productID)
    .andWhereNot('ps.productID', req.params.productID)

  if (product === undefined) return {}

  const images = await db<Image>('images')
    .where('productID', product.productID)
    .andWhere('index', 0)

  return {
    ...product,
    images,
    price: product.price / 100,
    stars: parseFloat(product.stars),
    reviewCount: parseFloat(product.reviewCount)
  }
}

const getAfter = async (req: Request): Promise<ProductRelData[]> => {
  const products: (Pick<Product, 'title' | 'price' | 'productID'> & { stars: string; reviewCount: string })[] = await getRelsQuery.clone()
    .select('ps.title', 'ps.price', 'ps.productID')
    .where('p.productID', req.params.productID)
    .andWhereNot('ps.productID', req.params.productID)
    .limit(Math.floor(Math.random() * (4 - 2) + 2))

  if (products.length === 0) return []
  const productIDs = products.map((p) => p.productID)

  const images = await db<Image>('images')
    .whereIn('productID', productIDs)
    .andWhere('index', 0)

  return products.map((p) => ({
    ...p,
    images: images.filter((i) => i.productID === p.productID),
    price: p.price / 100,
    stars: parseFloat(p.stars),
    reviewCount: parseFloat(p.reviewCount)
  })
  )
}

const getMoreToExplore = async (req: Request): Promise<ProductRelData[]> => {
  const products: any[] = await db('products as p')
    .select('p.title', 'p.price', 'p.productID')
    .avg('stars as stars')
    .count('r.reviewID as reviewCount')
    .andWhere('r.moderationStatus', 'APPROVED')
    .andWhereNot('p.productID', req.params.productID)
    .leftJoin('reviews as r', 'p.groupID', 'r.groupID')
    .orderByRaw('random()')
    .limit(Math.floor(Math.random() * (13 - 9) + 9))
    .groupBy('p.title', 'p.price', 'p.productID')

  if (products.length === 0) return []
  const productIDs = products.map((p) => p.productID)

  const images = await db<Image>('images')
    .whereIn('productID', productIDs)
    .andWhere('index', 0)

  return products.map((p) => ({
    ...p,
    images: images.filter((i) => i.productID === p.productID),
    price: p.price / 100,
    stars: parseFloat(p.stars),
    reviewCount: parseFloat(p.reviewCount)
  })
  )
}

const getCompare = async (req: Request): Promise<ProductRelData[] | null> => {
  const { productID } = req.params

  const products: (Pick<Product, 'title' | 'price' | 'productID' | 'groupID'> & { stars: string; reviewCount: string })[] = await getRelsQuery.clone()
    .select('ps.title', 'ps.price', 'ps.productID', 'ps.groupID')
    .where('p.productID', productID)
    .andWhereNot('ps.stock', 0)

  if (products.length === 0) return []

  const productIDs = products
    .map((p) => p.productID)

  const productParameters = await db('productParameters as pp')
    .join('parameters as p', 'pp.parameterID', 'p.parameterID')
    .whereIn('pp.productID', productIDs)

  const curProductParameterIDs = productParameters
    .filter((pp) => pp.productID === Number(productID))
    .map((pp) => pp.parameterID)

  const parameters = productParameters
    .filter((pp) => curProductParameterIDs.includes(pp.parameterID) && pp.productID !== Number(productID))
    .reduce((acc, cur) => {
      if (acc[cur.parameterID] === undefined) {
        acc[cur.parameterID] = [ cur ]
      } else {
        acc[cur.parameterID].push(cur)
      }
      return acc
    }, {} as ObjIndexed)

  const _parameters: any = Object.values(parameters)
    .filter((p: any) => p.length > 4)

  if (_parameters.length < 2) return []

  const batch = products
    .filter((p) => p.productID !== Number(productID))

  if (batch.length < 3) return []

  const batchWithCounts = batch
    .map((p) => {
      let matchCount = 0

      _parameters.forEach((pr: any) => {
        const match = pr.find((i: any) => i.productID === p.productID)
        if (match) { matchCount += 1 }
      })

      return { ...p, matchCount }
    })
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 4)

  const _batch: (Pick<Product, 'title' | 'price' | 'productID' | 'groupID'> & { stars: string; reviewCount: string; ratingStats: { stars: number; count: string }[] })[] = await Promise.all(batchWithCounts.map(async (p) => ({
    ...p,
    ratingStats: (await db('reviews')
      .select('stars')
      .count('stars')
      .where('groupID', p.groupID)
      .andWhere('moderationStatus', 'APPROVED')
      .groupBy('stars')
    ) as { stars: number; count: string }[]
  })))

  const images = await db<Image>('images')
    .whereIn('productID', _batch.map((p) => p.productID))
    .andWhere('index', 0)

  return _batch
    .map((p) => ({
      ...omit([ 'matchCount' ], p),
      images: images.filter((i) => i.productID === p.productID),
      price: p.price / 100,
      stars: parseFloat(p.stars),
      reviewCount: parseFloat(p.reviewCount),
      productParameters: flatten(_parameters).filter((pp: any) => pp.productID === p.productID),
      ratingStats: p.ratingStats.reduce((acc, cur) => {
        acc[cur.stars] = Number(cur.count)
        return acc
      }, {} as { [ k: number ]: number })
    })
    )
}

export default {
  getSimilar,
  getMoreToExplore,
  getAfter,
  getCompare
}
