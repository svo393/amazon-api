import { Request } from 'express'
import Knex from 'knex'
import { omit } from 'ramda'
import { Image, List, ListCreateInput, ListProduct, ListUpdateInput, Product, ProductSize } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addList = async (listInput: ListCreateInput, req: Request): Promise<List> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const { rows: [ addedList ] }: { rows: List[] } = await trx.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ trx('lists').insert({
      ...omit([ 'productID' ], listInput),
      userID: req.session?.userID
    }) ]
    )

    if (addedList === undefined) {
      throw new StatusError(409, `List with name "${listInput.name}" already exists`)
    }

    const { rows: [ addedLP ] }: { rows: ListProduct[] } = await trx.raw(
      `
      ? ON CONFLICT
        DO NOTHING
        RETURNING *;
      `,
      [ trx('listProducts').insert({
        listID: addedList.listID,
        productID: listInput.productID
      }) ]
    )

    if (addedLP === undefined) {
      throw new StatusError(409, 'This product is already added to the list')
    }

    return addedList
  })
}

const getListsByUser = async (req: Request): Promise<List[]> => {
  return await db('lists')
    .where('userID', req.params.userID)
}

type ListProductData = Pick<Product, 'productID' | 'price'> & {
  productSizes: ProductSize[];
  images: Image[];
}

const getListByID = async (req: Request): Promise<List & { products: ListProductData[] }> => {
  const { listID } = req.params

  const list = await db<List>('lists')
    .first()
    .where('listID', listID)

  const listProducts: Pick<Product, 'productID' | 'price' | 'isAvailable' | 'stock'>[] = await db('listProducts as lp')
    .select(
      'lp.productID',
      'p.price',
      'p.isAvailable',
      'p.stock'
    )
    .where('lp.listID', listID)
    .leftJoin('products as p', 'lp.productID', 'p.productID')

  const productIDs = listProducts.map((lp) => lp.productID)

  const images = await db<Image>('images')
    .whereIn('productID', productIDs)
    .andWhere('index', 0)

  const productSizes = await db<ProductSize>('productSizes')
    .whereIn('productID', productIDs)

  if (list === undefined) throw new StatusError(404, 'Not Found')
  return {
    ...list,
    products: listProducts.map((lp) => ({
      ...lp,
      price: lp.price / 100,
      productSizes: productSizes.filter((ps) => ps.productID === lp.productID),
      images: images.filter((i) => i.productID === lp.productID)
    }))
  }
}

const updateList = async (listInput: ListUpdateInput, req: Request): Promise<List> => {
  const [ updatedList ]: List[] = await db('lists')
    .update(listInput, [ '*' ])
    .where('listID', req.params.listID)

  if (updatedList === undefined) throw new StatusError(404, 'Not Found')
  return updatedList
}

const deleteList = async (req: Request): Promise<List> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const list = await trx<List>('lists')
      .first()
      .where('listID', req.params.listID)

    const deleteCount = await trx('lists')
      .del()
      .where('listID', req.params.listID)

    if (deleteCount === 0) throw new StatusError(404, 'Not Found')

    return list
  })
}

export default {
  addList,
  getListsByUser,
  getListByID,
  updateList,
  deleteList
}
