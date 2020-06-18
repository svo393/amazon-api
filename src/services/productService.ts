import { Request, Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { GroupVariant, Parameter, Product, ProductAllData, ProductCreateInput, ProductUpdateInput } from '../types'
import { db, dbTrans } from '../utils/db'
import { uploadImages } from '../utils/img'
import { getProductsQuery } from '../utils/queries'
import StatusError from '../utils/StatusError'

const addProduct = async (productInput: ProductCreateInput, res: Response): Promise<Product> => {
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const groupID = productInput.groupID
      ? productInput.groupID
      : (await trx('groups').insert({}, [ '*' ]))[0].groupID

    const [ addedProduct ]: Product[] = await trx('products')
      .insert({
        ...R.omit([ 'parameters', 'variants' ], productInput),
        userID: res.locals.userID,
        createdAt: now,
        updatedAt: now,
        groupID
      }, [ '*' ])

    if (productInput.variants) {
      await trx('groupVariants')
        .insert(productInput.variants.map((gv) => ({
          name: gv.name,
          value: gv.value,
          groupID,
          productID: addedProduct.productID
        })), [ '*' ])
    }

    if (productInput.parameters && !R.isEmpty(productInput.parameters)) {
      const { rows: addedParameters }: { rows: Parameter[] } = await trx.raw(
        `? ON CONFLICT ("name")
           DO UPDATE SET
           "name" = EXCLUDED."name"
           RETURNING *;`,
        [
          trx('parameters')
            .insert(productInput.parameters.map((p) => ({ name: p.name })))
        ]
      )

      await trx('productParameters')
        .insert(productInput.parameters.map((pp) => ({
          value: pp.value,
          parameterID: (addedParameters.find((p) => p.name === pp.name))?.parameterID,
          productID: addedProduct.productID
        })), [ '*' ])
    }
    return addedProduct
  })
}

type ProductListData = Pick<Product,
  | 'productID'
  | 'title'
  | 'price'
  | 'primaryMedia'
  | 'stock'
  | 'groupID'
  | 'isAvailable'
> & {
  stars: number;
  ratingCount: number;
  vendorName: string;
  categoryName: string;
}

export const getProducts = async ({ query: queryArgs }: Request): Promise<ProductListData[]> => {
  // TODO refactor reusable queries
  let products: ProductListData[] = await getProductsQuery.clone()

  if ('groupID' in queryArgs && !R.isEmpty(queryArgs.groupID)) {
    products = products.filter((p) =>
      p.groupID === Number(queryArgs.groupID)
    )
  }

  if ('title' in queryArgs && !R.isEmpty(queryArgs.title)) {
    products = products.filter((p) =>
      p.title.toLowerCase().includes(queryArgs.title.toString().toLowerCase()))
  }

  if ('priceMin' in queryArgs && !R.isEmpty(queryArgs.priceMin)) {
    products = products.filter((p) =>
      p.price >= Number(queryArgs.priceMin) * 100
    )
  }

  if ('priceMax' in queryArgs && !R.isEmpty(queryArgs.priceMax)) {
    products = products.filter((p) =>
      p.price <= Number(queryArgs.priceMax) * 100
    )
  }

  if ('vendorName' in queryArgs && !R.isEmpty(queryArgs.vendorName)) {
    products = products.filter((p) =>
      p.vendorName.includes(queryArgs.vendorName.toString()))
  }

  if ('categoryName' in queryArgs && !R.isEmpty(queryArgs.categoryName)) {
    products = products.filter((p) =>
      p.categoryName.includes(queryArgs.categoryName.toString()))
  }

  if ('stockMin' in queryArgs && !R.isEmpty(queryArgs.stockMin)) {
    products = products.filter((p) =>
      p.stock >= Number(queryArgs.stockMin)
    )
  }

  if ('stockMax' in queryArgs && !R.isEmpty(queryArgs.stockMax)) {
    products = products.filter((p) =>
      p.stock <= Number(queryArgs.stockMax)
    )
  }

  if ('isAvailable' in queryArgs && !R.isEmpty(queryArgs.isAvailable)) {
    products = products.filter((p) =>
      p.isAvailable === Boolean(queryArgs.isAvailable.toString())
    )
  }

  if ('starsMax' in queryArgs && !R.isEmpty(queryArgs.starsMax)) {
    products = products.filter((p) =>
      p.stars <= Number(queryArgs.starsMax)
    )
  }

  if ('starsMin' in queryArgs && !R.isEmpty(queryArgs.starsMin)) {
    products = products.filter((p) =>
      p.stars >= Number(queryArgs.starsMin)
    )
  }

  if ('ratingMax' in queryArgs && !R.isEmpty(queryArgs.ratingMax)) {
    products = products.filter((p) =>
      p.ratingCount <= Number(queryArgs.ratingMax)
    )
  }

  if ('ratingMin' in queryArgs && !R.isEmpty(queryArgs.ratingMin)) {
    products = products.filter((p) =>
      p.ratingCount >= Number(queryArgs.ratingMin)
    )
  }

  return products
}

const getProductByID = async (req: Request, res: Response): Promise<ProductListData| ProductAllData> => {
  const [ product ] = await getProductsQuery.clone()
    .select('p.createdAt', 'p.updatedAt', 'p.userID')
    .where('p.productID', req.params.productID)
    .leftJoin('groupVariants as gv', 'p.groupID', 'gv.groupID')

  if (!product) throw new StatusError(404, 'Not Found')

  const groupVariants = await db<GroupVariant>('groupVariants')
    .where('groupID', product.groupID)

  const fullProduct = { ...product, group: groupVariants }

  const role: string | undefined = res.locals.userRole

  return role && [ 'ROOT', 'ADMIN' ].includes(role)
    ? fullProduct
    : R.omit([
      'createdAt',
      'updatedAt',
      'userID'
    ], fullProduct)
}

const updateProduct = async (productInput: ProductUpdateInput, req: Request): Promise<Product> => {
  const [ updatedProduct ]: Product[] = await db('products')
    .update({
      ...productInput,
      updatedAt: new Date()
    }, [ '*' ])
    .where('productID', req.params.productID)

  if (!updatedProduct) throw new StatusError(404, 'Not Found')
  return updatedProduct
}

const uploadProductImages = (files: Express.Multer.File[], req: Request): void => {
  const uploadConfig = {
    imagePath: './public/media/products',
    maxWidth: 1500,
    maxHeight: 1500,
    previewWidth: 425,
    previewHeight: 425,
    thumbWidth: 40,
    thumbHeight: 40
  }
  uploadImages(files, req, uploadConfig, 'productID')
}

export default {
  addProduct,
  getProducts,
  getProductByID,
  updateProduct,
  uploadProductImages
}
