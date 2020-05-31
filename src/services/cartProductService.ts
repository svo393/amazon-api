import { Request } from 'express'
import { CartProduct, CartProductInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addCartProduct = async (cartProductInput: CartProduct): Promise<CartProduct> => {
  const { rows: [ addedCP ] }: { rows: CartProduct[] } = await db.raw(
    `? ON CONFLICT ("userID", "productID")
       DO UPDATE SET
       "qty" = EXCLUDED."qty"
       RETURNING *;`,
    [ db('cartProducts').insert(cartProductInput) ]
  )
  return addedCP
}

const getCartProductByID = async (req: Request): Promise<CartProduct> => {
  return await db('cartProducts')
    .first()
    .where('userID', req.params.userID)
    .andWhere('productID', req.params.productID)
}

const getCartProductsByUser = async (req: Request): Promise<CartProduct[]> => {
  return await db('cartProducts')
    .where('userID', req.params.userID)
}

const updateCartProduct = async (cartProductInput: CartProductInput, req: Request): Promise<CartProduct> => {
  const [ updatedCP ]: CartProduct[] = await db('cartProducts')
    .update(cartProductInput, [ '*' ])
    .where('userID', req.params.userID)
    .andWhere('productID', req.params.productID)

  if (!updatedCP) throw new StatusError(404, 'Not Found')
  return updatedCP
}

const deleteCartProduct = async (req: Request): Promise<void> => {
  const deleteCount = await db('cartProducts')
    .del()
    .where('userID', req.params.userID)
    .andWhere('productID', req.params.productID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addCartProduct,
  getCartProductByID,
  updateCartProduct,
  getCartProductsByUser,
  deleteCartProduct
}
