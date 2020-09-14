import { Request } from 'express'
import { List, ListProduct } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'
import Knex from 'knex'

const addListProduct = async (req: Request): Promise<ListProduct> => {
  const { rows: [ addedLP ] }: { rows: ListProduct[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('listProducts').insert({
      listID: req.params.listID,
      productID: req.params.productID
    }) ]
  )

  if (addedLP === undefined) {
    throw new StatusError(409, 'This product is already added to the list')
  }

  return addedLP
}

const deleteListProduct = async (req: Request): Promise<ListProduct & { isListDeleted?: true }> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    let isListDeleted

    const listProduct = await trx<ListProduct>('listProducts')
      .first()
      .where('productID', req.params.productID)
      .andWhere('listID', req.params.listID)

    const deleteCount = await trx('listProducts')
      .del()
      .where('productID', req.params.productID)
      .andWhere('listID', req.params.listID)

    const restListProducts = await trx<ListProduct>('listProducts')
      .andWhere('listID', req.params.listID)

    if (restListProducts.length === 0) {
      const deleteListCount = await trx('lists')
        .del()
        .where('listID', req.params.listID)

      if (deleteListCount === 0) throw new StatusError()
      isListDeleted = true
    }

    if (deleteCount === 0) throw new StatusError(404, 'Not Found')

    return { ...listProduct, isListDeleted }
  })
}

export default {
  addListProduct,
  deleteListProduct
}
