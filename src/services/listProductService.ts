import { Request } from 'express'
import { ListProduct } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addListProduct = async (req: Request): Promise<ListProduct> => {
  const { listID, productID } = req.params

  const { rows: [ addedUA ] }: { rows: ListProduct[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('listProducts').insert({
      listID: Number(listID),
      productID: Number(productID)
    }) ]
  )

  if (!addedUA) {
    throw new StatusError(409, 'This product already added to the list')
  }
  return addedUA
}

const deleteListProduct = async (req: Request): Promise<void> => {
  const { listID, productID } = req.params

  const deleteCount = await db<ListProduct>('listProducts')
    .del()
    .where('productID', productID)
    .andWhere('listID', listID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addListProduct,
  deleteListProduct
}
