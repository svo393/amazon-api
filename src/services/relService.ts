import { Request } from 'express'
import { flatten } from 'ramda'
import { Image, ObjIndexed, Product, Vote } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

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
  const productIDs = products.map((p) => p.productID)

  const productParameters = await db('productParameters as pp')
    .join('parameters as p', 'pp.parameterID', 'p.parameterID')
    .whereIn('pp.productID', productIDs)

  const parameters = productParameters
    .reduce((acc, cur) => {
      if (acc[cur.parameterID] === undefined) {
        acc[cur.parameterID] = [ cur ]
      } else {
        acc[cur.parameterID].push(cur)
      }
      return acc
    }, {} as ObjIndexed)

  const _parameters: any = Object.values(parameters)
    .filter((p: any) => {
      return p.length > 4 &&
        p.find((p: any) => p.productID === Number(productID))
    })

  if (_parameters.length < 2) return []

  const images = await db<Image>('images')
    .whereIn('productID', productIDs)
    .andWhere('index', 0)

  const batch = products
    .filter((p) => p.productID !== Number(productID))

  if (batch.length < 4) return []

  const _batch: (Pick<Product, 'title' | 'price' | 'productID' | 'groupID'> & { stars: string; reviewCount: string; ratingStats: { stars: number; count: string }[] })[] = await Promise.all(batch.map(async (p) => ({
    ...p,
    ratingStats: (await db('reviews')
      .select('stars')
      .count('stars')
      .where('groupID', p.groupID)
      .groupBy('stars')
    ) as { stars: number; count: string }[]
  })))

  return _batch
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((p) => ({
      ...p,
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
