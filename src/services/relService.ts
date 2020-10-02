import { Request } from 'express'
import { Image, Product, Vote } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

type ProductRelData = Pick<Product, 'title' | 'price' | 'productID'> & {
  stars: number;
  images: Image[];
  reviewCount: number
}

const getSimilar = async (req: Request): Promise<ProductRelData> => {
  const product: Pick<Product, 'title' | 'price' | 'productID'> & { stars: string; reviewCount: string } = await db('products as p')
    .first('ps.title', 'ps.price', 'ps.productID')
    .avg('stars as stars')
    .count('r.reviewID as reviewCount')
    .where('p.productID', req.params.productID)
    .andWhere('r.moderationStatus', 'APPROVED')
    .andWhereNot('ps.productID', req.params.productID)
    .leftJoin('products as ps', 'p.categoryID', 'ps.categoryID')
    .leftJoin('reviews as r', 'p.groupID', 'r.groupID')
    .orderByRaw('random()')
    .groupBy('ps.title', 'ps.price', 'ps.productID')

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

const getWith = async (req: Request): Promise<Vote[]> => {
  const products = await db<Product>('products')
    .select('productID')
    .where('groupID', req.params.groupID)

  return await db('votes')
    .whereIn('productID', products.map((p) => p.productID))
}

export default {
  getSimilar,
  getWith
  // getSponsored,
  // getAfter,
  // getCompare
}
