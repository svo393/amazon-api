import { db } from './db'

export const getProductsQuery: any = db('products as p')
  .select('p.productID', 'p.title', 'listPrice', 'price', 'primaryMedia')
  .avg('stars as stars')
  .count('r.ratingID as ratingCount')
  .leftJoin('ratings as r', 'p.productID', 'r.productID')
  .groupBy('p.productID')
