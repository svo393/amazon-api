import { Request } from 'express'
import Knex from 'knex'
import { mergeDeepRight } from 'ramda'
import { CartProduct, CartProductInput, LocalCart } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addCartProduct = async (cartProductInput: CartProductInput, req: Request): Promise<CartProduct> => {
  const { rows: [ addedCP ] }: { rows: CartProduct[] } = await db.raw(
    `
    ? ON CONFLICT ("userID", "productID")
      DO UPDATE SET
      "qty" = EXCLUDED."qty"
      RETURNING *;
    `,
    [ db('cartProducts').insert({
      ...cartProductInput,
      userID: req.params.userID,
      productID: req.params.productID
    }) ]
  )
  return addedCP
}

const getCartProductByID = async (req: Request): Promise<CartProduct> => {
  return await db('cartProducts')
    .first()
    .where('userID', req.params.userID)
    .andWhere('productID', req.params.productID)
}

const getCartProductsByUser = async (localCart: LocalCart, req: Request): Promise<CartProduct[]> => {
  const userID = req.params.userID
  return await dbTrans(async (trx: Knex.Transaction) => {
    await Promise.all(localCart.map(async (cp) => {
      await trx.raw(
        `
        ? ON CONFLICT ("userID", "productID")
          DO UPDATE SET
          "qty" = EXCLUDED."qty"
          RETURNING *;
        `,
        [ trx('cartProducts').insert({ ...cp, userID }) ]
      )
    }))

    return await trx<CartProduct>('cartProducts')
      .where('userID', userID)
  })
}

const updateCartProduct = async (cartProductInput: CartProductInput, req: Request): Promise<CartProduct> => {
  const [ updatedCP ]: CartProduct[] = await db('cartProducts')
    .update(cartProductInput, [ '*' ])
    .where('userID', req.params.userID)
    .andWhere('productID', req.params.productID)

  if (updatedCP === undefined) throw new StatusError(404, 'Not Found')
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
