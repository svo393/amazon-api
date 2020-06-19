import { Request, Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { GroupVariant, Parameter, Product, ProductAllData, ProductCreateInput, ProductsFiltersInput, ProductUpdateInput } from '../types'
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

    if (productInput.parameters !== undefined && productInput.parameters.length !== 0) {
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

export const getProducts = async (productFilterInput: ProductsFiltersInput): Promise<ProductListData[]> => {
  const {
    groupID,
    title,
    priceMin,
    priceMax,
    vendorName,
    categoryName,
    stockMin,
    stockMax,
    isAvailable,
    starsMax,
    starsMin,
    ratingMax,
    ratingMin
  } = productFilterInput
  // TODO refactor reusable queries
  let products: ProductListData[] = await getProductsQuery.clone()

  if (groupID !== undefined) {
    products = products
      .filter((p) => p.groupID === groupID)
  }

  if (title !== undefined) {
    products = products
      .filter((p) => p.title.toLowerCase().includes(title.toLowerCase()))
  }

  if (priceMin !== undefined) {
    products = products
      .filter((p) => p.price >= priceMin * 100)
  }

  if (priceMax !== undefined) {
    products = products
      .filter((p) => p.price <= priceMax * 100)
  }

  if (vendorName !== undefined) {
    products = products
      .filter((p) => p.vendorName.includes(vendorName))
  }

  if (categoryName !== undefined) {
    products = products
      .filter((p) => p.categoryName.includes(categoryName))
  }

  if (stockMin !== undefined) {
    products = products
      .filter((p) => p.stock >= stockMin)
  }

  if (stockMax !== undefined) {
    products = products
      .filter((p) => p.stock <= stockMax)
  }

  if (isAvailable !== undefined) {
    products = products
      .filter((p) => p.isAvailable === isAvailable)
  }

  if (starsMin !== undefined) {
    products = products
      .filter((p) => p.stars >= starsMin)
  }

  if (starsMax !== undefined) {
    products = products
      .filter((p) => p.stars <= starsMax)
  }

  if (ratingMin !== undefined) {
    products = products
      .filter((p) => p.ratingCount >= ratingMin)
  }

  if (ratingMax !== undefined) {
    products = products
      .filter((p) => p.ratingCount <= ratingMax)
  }

  return products
}

type ProductData = ProductListData & {
  listPrice: number;
  media: number;
  description: string;
  brandSection: string;
  userEmail: string;
  stars: number;
  ratingCount: number;
  vendorName: string;
  categoryName: string;
}

const getProductByID = async (req: Request, res: Response): Promise<ProductData| ProductAllData> => {
  const [ product ] = await getProductsQuery.clone()
    .select(
      'p.createdAt',
      'p.updatedAt',
      'p.userID',
      'p.media',
      'p.listPrice',
      'p.description',
      'p.brandSection',
      'u.email as userEmail')
    .where('p.productID', req.params.productID)
    .leftJoin('groupVariants as gv', 'p.groupID', 'gv.groupID')
    .leftJoin('users as u', 'p.userID', 'u.userID')
    .groupBy('userEmail')

  if (product === undefined) throw new StatusError(404, 'Not Found')

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

  if (updatedProduct === undefined) throw new StatusError(404, 'Not Found')
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
