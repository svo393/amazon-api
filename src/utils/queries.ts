import { db } from './db'

export const getProductsQuery: any = db('products as p')
  .select(
    'p.productID',
    'p.title',
    'p.price',
    'p.primaryMedia',
    'p.stock',
    'p.groupID',
    'p.isAvailable',
    'v.name as vendorName',
    'c.name as categoryName'
  )
  .avg('stars as stars')
  .count('r.ratingID as ratingCount')
  .leftJoin('ratings as r', 'p.groupID', 'r.groupID')
  .leftJoin('vendors as v', 'p.vendorID', 'v.vendorID')
  .leftJoin('categories as c', 'p.categoryID', 'c.categoryID')
  .groupBy('p.productID', 'vendorName', 'categoryName')
