import { Request } from 'express'
import { ListProduct } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addListProduct = async (req: Request): Promise<ListProduct> => {
  const { rows: [ addedUA ] }: { rows: ListProduct[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('listProducts').insert({
      listID: Number(req.params.listID),
      productID: Number(req.params.productID)
    }) ]
  )

  if (!addedUA) {
    throw new StatusError(409, 'This product is already added to the list')
  }
  return addedUA
}

const deleteListProduct = async (req: Request): Promise<void> => {
  const deleteCount = await db('listProducts')
    .del()
    .where('productID', req.params.productID)
    .andWhere('listID', req.params.listID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addListProduct,
  deleteListProduct
}
