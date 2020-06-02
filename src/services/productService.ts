import { Request, Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { GroupVariant, Parameter, Product, ProductAllData, ProductCreateInput, ProductListData, ProductUpdateInput } from '../types'
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
        ...R.omit([ 'parameters', 'group' ], productInput),
        userID: res.locals.userID,
        productCreatedAt: now,
        productUpdatedAt: now
      }, [ '*' ])

    if (productInput.variants) {
      await trx('groupVariants')
        .insert(productInput.variants.map((gv) => ({
          name: gv.name,
          value: gv.value,
          groupID: groupID,
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

export const getProducts = async (): Promise<ProductListData[]> => {
  return await getProductsQuery.clone()
}

const getProductByID = async (req: Request, res: Response): Promise<ProductListData| ProductAllData> => {
  const [ product ] = await getProductsQuery.clone()
    .select('productCreatedAt', 'productUpdatedAt', 'p.userID')
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
      'productCreatedAt',
      'productUpdatedAt',
      'userID'
    ], fullProduct)
}

const updateProduct = async (productInput: ProductUpdateInput, req: Request): Promise<Product> => {
  const [ updatedProduct ]: Product[] = await db('products')
    .update({
      ...productInput,
      productUpdatedAt: new Date()
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
