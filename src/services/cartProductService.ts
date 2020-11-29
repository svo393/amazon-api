import { Request } from 'express'
import Knex from 'knex'
import { omit } from 'ramda'
import {
  CartProduct,
  CartProductDeleteInput,
  CartProductInput,
  Image,
  LocalCart,
  Product,
  ProductSize
} from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

type Cart = {
  products: (Pick<
    Product,
    'productID' | 'title' | 'price' | 'stock' | 'isAvailable'
  > & { images: Image[]; productSizes: ProductSize[] })[]
  cart: CartProduct[]
}

const addCartProduct = async (
  cartProductInput: CartProductInput,
  req: Request
): Promise<Cart> => {
  const { userID, productID } = req.params
  const { size, qty } = cartProductInput

  return await dbTrans(async (trx: Knex.Transaction) => {
    const product = await trx<Product>('products')
      .first('productID', 'title', 'price', 'stock', 'isAvailable')
      .where('productID', productID)

    if (product === undefined) throw new StatusError()

    const productSizes = await trx<ProductSize>('productSizes').where(
      'productID',
      productID
    )

    const _stock =
      size === 'stock'
        ? product.stock
        : productSizes.find(
            (ps) =>
              ps.productID === Number(productID) && ps.name === size
          )?.qty

    const cartProduct = await trx<CartProduct>('cartProducts')
      .first()
      .where('productID', productID)
      .andWhere('userID', userID)
      .andWhere('size', size)

    let newQty

    if (cartProduct !== undefined) {
      newQty =
        (_stock as number) < cartProduct.qty + qty
          ? (_stock as number)
          : cartProduct.qty + qty
    }

    const [addedCP]: CartProduct[] =
      newQty !== undefined
        ? await trx('cartProducts')
            .first()
            .update({ qty: newQty }, ['*'])
            .where('productID', productID)
            .andWhere('userID', userID)
            .andWhere('size', size)
        : await trx('cartProducts').insert(
            {
              ...cartProductInput,
              userID,
              productID
            },
            ['*']
          )

    const images = await trx<Image>('images').where(
      'productID',
      addedCP.productID
    )

    return {
      products: [
        {
          ...product,
          price: product.price / 100,
          images: images.filter(
            (i) => i.productID === addedCP.productID
          )
        }
      ],
      cart: [addedCP]
    }
  })
}

const getCartProductByID = async (
  req: Request
): Promise<CartProduct> => {
  return await db('cartProducts')
    .first()
    .where('userID', req.params.userID)
    .andWhere('productID', req.params.productID)
}

const getCartProductsByUser = async (
  localCart: LocalCart,
  req: Request
): Promise<Cart> => {
  const userID = req.params.userID
  const localCartProductIDs = localCart.map((cp) => cp.productID)

  return await dbTrans(async (trx: Knex.Transaction) => {
    const existingProducts = await trx<Product>('products')
      .select('productID', 'stock')
      .whereIn('productID', localCartProductIDs)

    const existingProductIDs = existingProducts.map(
      (p) => p.productID
    )

    const cart = await trx<CartProduct>('cartProducts').where(
      'userID',
      userID
    )

    const productSizes = await trx<ProductSize>(
      'productSizes'
    ).whereIn(
      'productID',
      localCartProductIDs.concat(cart.map((cp) => cp.productID))
    )

    const mergedCart = cart.map((cp) => {
      const item = localCart
        .filter((lcp) => lcp.toMerge)
        .find(
          (lcp) =>
            lcp.productID === cp.productID && lcp.size === cp.size
        )
      return item !== undefined
        ? { ...item, qty: item.qty + cp.qty }
        : cp
    })

    const _localCart = localCart
      .map((cp) => ({ ...cp, userID: Number(userID) }))
      .filter(
        (lcp) =>
          !cart.find(
            (cp) =>
              cp.productID === lcp.productID && cp.size === lcp.size
          )
      )

    const _mergedCart = mergedCart.concat(_localCart)

    await Promise.all(
      _mergedCart.map(async (cp) => {
        if (existingProductIDs.includes(cp.productID)) {
          const _stock =
            cp.size === 'stock'
              ? existingProducts.find(
                  (ep) => ep.productID === cp.productID
                )?.stock
              : productSizes.find(
                  (ps) =>
                    ps.productID === cp.productID &&
                    ps.name === cp.size
                )?.qty

          const cartProduct = cart.find(
            (i) => i.productID === cp.productID && i.size === cp.size
          )

          let newQty

          if (cartProduct !== undefined) {
            newQty =
              (_stock as number) < cp.qty
                ? (_stock as number)
                : cp.qty
          }

          newQty !== undefined
            ? await trx('cartProducts')
                .update({ qty: newQty }, ['*'])
                .where('productID', cp.productID)
                .andWhere('userID', userID)
                .andWhere('size', cp.size)
            : await trx('cartProducts').insert(
                { ...omit(['toMerge'], cp), userID },
                ['*']
              )
        }
      })
    )

    const updatedCart = await trx<CartProduct>('cartProducts').where(
      'userID',
      userID
    )

    const productIDs = updatedCart.map((cp) => cp.productID)

    const products = await trx<Product>('products')
      .select('productID', 'title', 'price', 'stock', 'isAvailable')
      .whereIn('productID', productIDs)

    const images = await trx<Image>('images').whereIn(
      'productID',
      productIDs
    )

    return {
      products: products.map((p) => ({
        ...p,
        productSizes: productSizes.filter(
          (ps) => ps.productID === p.productID
        ),
        price: p.price / 100,
        images: images.filter((i) => i.productID === p.productID)
      })),
      cart: updatedCart
    }
  })
}

const getProductsForLocalCart = async (
  localCart: LocalCart
): Promise<Pick<Cart, 'products'>> => {
  const productIDs = localCart.map((cp) => cp.productID)

  const products = await db<Product>('products')
    .select('productID', 'title', 'price', 'stock', 'isAvailable')
    .whereIn('productID', productIDs)

  const productSizes = await db<ProductSize>('productSizes').whereIn(
    'productID',
    productIDs
  )

  const images = await db<Image>('images').whereIn(
    'productID',
    productIDs
  )

  return {
    products: products.map((p) => ({
      ...p,
      productSizes: productSizes.filter(
        (ps) => ps.productID === p.productID
      ),
      price: p.price / 100,
      images: images.filter((i) => i.productID === p.productID)
    }))
  }
}

const updateCartProduct = async (
  cartProductInput: CartProductInput,
  req: Request
): Promise<CartProduct> => {
  const { userID, productID } = req.params
  const { size, qty } = cartProductInput

  return await dbTrans(async (trx: Knex.Transaction) => {
    const product = await trx<Product>('products')
      .first('productID', 'title', 'price', 'stock', 'isAvailable')
      .where('productID', productID)

    if (product === undefined) throw new StatusError()

    const productSizes = await trx<ProductSize>('productSizes').where(
      'productID',
      productID
    )

    const _stock =
      size === 'stock'
        ? product.stock
        : productSizes.find(
            (ps) =>
              ps.productID === Number(productID) && ps.name === size
          )?.qty

    const newQty = (_stock as number) < qty ? (_stock as number) : qty

    const [updatedCP]: CartProduct[] = await trx('cartProducts')
      .update({ qty: newQty }, ['*'])
      .where('userID', userID)
      .andWhere('productID', productID)
      .andWhere('size', size)

    return updatedCP
  })
}

const deleteCartProduct = async (
  cartProductInput: CartProductDeleteInput,
  req: Request
): Promise<CartProduct> => {
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
      .andWhere('size', cartProductInput.size)

    if (deleteCount === 0 || cartProduct === undefined)
      throw new StatusError(404, 'Not Found')

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
