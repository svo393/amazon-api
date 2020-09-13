import { Request } from 'express'
import { ListProduct } from '../types'
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

const deleteListProduct = async (req: Request): Promise<ListProduct> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const listProduct = await trx<ListProduct>('listProducts')
      .first()
      .where('productID', req.params.productID)
      .andWhere('listID', req.params.listID)

    const deleteCount = await trx('listProducts')
      .del()
      .where('productID', req.params.productID)
      .andWhere('listID', req.params.listID)

    if (deleteCount === 0) throw new StatusError(404, 'Not Found')

    return listProduct
  })
}

export default {
  addListProduct,
  deleteListProduct
}
