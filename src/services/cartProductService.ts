import { Request } from 'express'
import Knex from 'knex'
import { CartProduct, CartProductDeleteInput, CartProductInput, Image, LocalCart, Product, ProductSize } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

type Cart = {
  products: (Pick<Product, 'productID' |'title' |'price' |'stock' |'isAvailable'> & { images: Image[]; productSizes: ProductSize[] })[];
  cart: CartProduct[];
}

const addCartProduct = async (cartProductInput: CartProductInput, req: Request): Promise<Cart> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const { rows: [ addedCP ] }: { rows: CartProduct[] } = await trx.raw(
    `
    ? ON CONFLICT ("userID", "productID", "size")
    DO UPDATE SET
    "qty" = "cartProducts"."qty" + EXCLUDED."qty"
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
  const localCartProductIDs = localCart.map((cp) => cp.productID)

  return await dbTrans(async (trx: Knex.Transaction) => {
    const existingProducts = await trx<Product>('products')
      .select('productID')
      .whereIn('productID', localCartProductIDs)

    const existingProductIDs = existingProducts.map((p) => p.productID)

    await Promise.all(localCart.map(async (cp) => {
      if (existingProductIDs.includes(cp.productID)) {
        existingProductIDs.includes(cp.productID) && await trx.raw(
          `
          ? ON CONFLICT ("userID", "productID", "size")
          DO UPDATE SET
          "qty" = "cartProducts"."qty" + EXCLUDED."qty"
          RETURNING *;
          `,
          [ trx('cartProducts').insert({ ...cp, userID }) ]
        )
      }
    }))

    const cart = await trx<CartProduct>('cartProducts')
      .where('userID', userID)

    const productIDs = cart.map((cp) => cp.productID)

    const products = await trx<Product>('products')
      .select('productID', 'title', 'price', 'stock', 'isAvailable')
      .whereIn('productID', productIDs)

    const productSizes = await db<ProductSize>('productSizes')
      .whereIn('productID', productIDs)

    const images = await trx<Image>('images')
      .whereIn('productID', productIDs)

    return {
      products: products.map((p) => ({
        ...p,
        productSizes: productSizes.filter((ps) => ps.productID === p.productID),
        price: p.price / 100,
        images: images.filter((i) => i.productID === p.productID)
      })),
      cart
    }
  })
}

const getProductsForLocalCart = async (localCart: LocalCart): Promise<Pick<Cart, 'products'>> => {
  const productIDs = localCart.map((cp) => cp.productID)

  const products = await db<Product>('products')
    .select('productID', 'title', 'price', 'stock', 'isAvailable')
    .whereIn('productID', productIDs)

  const productSizes = await db<ProductSize>('productSizes')
    .whereIn('productID', productIDs)

  const images = await db<Image>('images')
    .whereIn('productID', productIDs)

  return {
    products: products.map((p) => ({
      ...p,
      productSizes: productSizes.filter((ps) => ps.productID === p.productID),
      price: p.price / 100,
      images: images.filter((i) => i.productID === p.productID)
    }))
  }
}

const updateCartProduct = async (cartProductInput: CartProductInput, req: Request): Promise<CartProduct> => {
  const [ updatedCP ]: CartProduct[] = await db('cartProducts')
    .update({ qty: cartProductInput.qty }, [ '*' ])
    .where('userID', req.params.userID)
    .andWhere('productID', req.params.productID)
    .andWhere('size', cartProductInput.size)

  if (updatedCP === undefined) throw new StatusError(404, 'Not Found')
  return updatedCP
}

const deleteCartProduct = async (cartProductInput: CartProductDeleteInput, req: Request): Promise<CartProduct> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const cartProduct = await trx<CartProduct>('cartProducts')
      .first('productID', 'size')
      .where('userID', req.params.userID)
      .andWhere('productID', req.params.productID)
      .andWhere('size', cartProductInput.size)

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
  getProductsForLocalCart,
  deleteCartProduct
}
