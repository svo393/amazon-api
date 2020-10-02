import { Request } from 'express'
import { Image, Product, Vote } from '../types'
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

const getSimilar = async (req: Request): Promise<ProductRelData> => {
  const product: Pick<Product, 'title' | 'price' | 'productID'> & { stars: string; reviewCount: string } = await getRelsQuery.clone()
    .first('ps.title', 'ps.price', 'ps.productID')
    .where('p.productID', req.params.productID)
    .andWhereNot('ps.productID', req.params.productID)

  if (product === undefined) throw new StatusError(404, 'Not Found')

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

  if (products.length === 0) throw new StatusError(404, 'Not Found')
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

const getSponsored = async (req: Request): Promise<ProductRelData[]> => {
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

  if (products.length === 0) throw new StatusError(404, 'Not Found')
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

export default {
  getSimilar,
  getSponsored,
  getAfter
  // getCompare
}
