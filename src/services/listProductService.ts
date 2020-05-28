import { Request } from 'express'
import { ListProduct } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addListProduct = async (req: Request): Promise<ListProduct> => {
  const { listID, productID } = req.params

  const existingUA = await db<ListProduct>('listProducts')
    .first()
    .where('listID', listID)
    .andWhere('productID', productID)

  if (existingUA) throw new StatusError(409, 'This product already added to the list')

  const [ addedUA ]: ListProduct[] = await db<ListProduct>('listProducts')
    .insert({
      listID: Number(listID),
      productID: Number(productID)
    }, [ '*' ])

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
