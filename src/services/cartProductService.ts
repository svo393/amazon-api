import { Request } from 'express'
import Knex from 'knex'
import { CartProduct, CartProductInput, Image, LocalCart, Product } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

type Cart = {
  products: Pick<Product, 'productID' |'title' |'price' |'stock' |'isAvailable'> & { images: Image[] };
  cart: CartProduct[];
}

const addCartProduct = async (cartProductInput: CartProductInput, req: Request): Promise<Cart> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const { rows: [ addedCP ] }: { rows: CartProduct[] } = await trx.raw(
    `
    ? ON CONFLICT ("userID", "productID")
      DO UPDATE SET
      "qty" = EXCLUDED."qty"
      RETURNING *;
    `,
    [ trx('cartProducts').insert({
      ...cartProductInput,
      userID: req.params.userID,
      productID: req.params.productID
    }) ]
    )

    const product = await trx<Product>('products')
      .first('productID', 'title', 'price', 'stock', 'isAvailable')
      .where('productID', addedCP.productID)

    if (product === undefined) throw new StatusError()

    const images = await trx<Image>('images')
      .where('productID', addedCP.productID)

    return {
      products: [ {
        ...product,
        price: product.price / 100,
        images: images.filter((i) => i.productID === addedCP.productID)
      } ],
      cart: [ addedCP ]
    }
  })
}

const getCartProductByID = async (req: Request): Promise<CartProduct> => {
  return await db('cartProducts')
    .first()
    .where('userID', req.params.userID)
    .andWhere('productID', req.params.productID)
}

const getCartProductsByUser = async (localCart: LocalCart, req: Request): Promise<Cart> => {
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

    const cart = await trx<CartProduct>('cartProducts')
      .where('userID', userID)

    const productIDs = cart.map((cp) => cp.productID)

    const products = await trx<Product>('products')
      .select('productID', 'title', 'price', 'stock', 'isAvailable')
      .whereIn('productID', productIDs)

    const images = await trx<Image>('images')
      .whereIn('productID', productIDs)

    return {
      products: products.map((p) => ({
        ...p,
        price: p.price / 100,
        images: images.filter((i) => i.productID === p.productID)
      })),
      cart
    }
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

const deleteCartProduct = async (req: Request): Promise<CartProduct> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const cartProduct = await trx<CartProduct>('cartProducts')
      .first('productID')
      .where('userID', req.params.userID)
      .andWhere('productID', req.params.productID)

    const deleteCount = await trx('cartProducts')
      .del()
      .where('userID', req.params.userID)
      .andWhere('productID', req.params.productID)

    if (deleteCount === 0 || cartProduct === undefined) throw new StatusError(404, 'Not Found')

    return cartProduct
  })
}

export default {
  addCartProduct,
  getCartProductByID,
  updateCartProduct,
  getCartProductsByUser,
  deleteCartProduct
}
