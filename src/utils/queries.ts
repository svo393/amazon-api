import { db } from './db'

export const getProductsQuery: any = db('products as p')
  .select('p.productID', 'p.title', 'listPrice', 'price', 'primaryMedia', 'p.groupID')
  .avg('stars as stars')
  .count('r.ratingID as ratingCount')
  .leftJoin('ratings as r', 'p.groupID', 'r.groupID')
  .groupBy('p.productID')
