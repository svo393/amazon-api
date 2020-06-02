import { Request, Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { FormattedGroups, Group, GroupProduct, Parameter, Product, ProductAllData, ProductCreateInput, ProductListData, ProductParameter, ProductPublicData, ProductUpdateInput } from '../types'
import { db, dbTrans } from '../utils/db'
import { uploadImages } from '../utils/img'
import { getProductsQuery } from '../utils/queries'
import StatusError from '../utils/StatusError'

const addProduct = async (productInput: ProductCreateInput, res: Response): Promise<ProductPublicData & { parameters?: Parameter[] }> => {
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    let parameters
    let groups

    const [ addedProduct ]: Product[] = await trx('products')
      .insert({
        ...R.omit([ 'parameters', 'groups' ], productInput),
        userID: res.locals.userID,
        productCreatedAt: now,
        productUpdatedAt: now
      }, [ '*' ])

    const publicProduct = R.omit([
      'productCreatedAt',
      'productUpdatedAt',
      'userID'
    ], addedProduct)

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

      const addedProductParameters: ProductParameter[] = await trx('productParameters')
        .insert(productInput.parameters.map((pp) => ({
          value: pp.value,
          parameterID: (addedParameters.find((p) => p.name === pp.name))?.parameterID,
          productID: addedProduct.productID
        })), [ '*' ])

      parameters = addedParameters.map((p) => ({
        [p.name]: {
          ...p,
          ...addedProductParameters.find((pp) => pp.parameterID === p.parameterID)
        }
      }))
    }

    if (productInput.groups && !R.isEmpty(productInput.groups)) {
      const addedGroups: Group[] = await Promise.all(productInput.groups.map(async (g) => {
        if (g.groupID) return { name: g.name, groupID: g.groupID }

        const [ group ]: Group[] = await trx('groups')
          .insert({ name: g.name }, [ '*' ])

        return group
      }))

      const addedGroupProducts: GroupProduct[] = await trx('groupProducts')
        .insert(productInput.groups.map((gg) => ({
          value: gg.value,
          groupID: (addedGroups.find((g) => g.name === gg.name))?.groupID,
          productID: addedProduct.productID
        })), [ '*' ])

      groups = addedGroups.map((g) => ({
        [g.name]: {
          ...g,
          ...addedGroupProducts.find((gg) => gg.groupID === g.groupID)
        }
      }))
    }

    return {
      ...publicProduct,
      groups,
      parameters
    }
  })
}

export const getProducts = async (): Promise<ProductListData[]> => {
  return await getProductsQuery.clone()
}

const getProductByID = async (req: Request, res: Response): Promise<ProductListData| ProductAllData> => {
  const [ product ]: ProductAllData[] = await getProductsQuery.clone()
    .select('productCreatedAt', 'productUpdatedAt', 'p.userID')
    .where('p.productID', req.params.productID)

  if (!product) throw new StatusError(404, 'Not Found')

  const groupIDs = await db('groupProducts as gp')
    .select('g.groupID')
    .leftJoin('groups as g', 'gp.groupID', 'g.groupID')
    .where('productID', product.productID)

  const groups = await db('groups as g')
    .leftJoin('groupProducts as gp', 'gp.groupID', 'g.groupID')
    .whereIn('g.groupID', groupIDs.map((id) => id.groupID))
    .orderBy('g.name')

  const formattedGroups: FormattedGroups = groups.reduce((acc, cur) => {
    return acc[cur.name]
      ? { ...acc, [cur.name]: [ ...acc[cur.name], cur ] }
      : { ...acc, [cur.name]: [ cur ] }
  }, {})

  const fullProduct = { ...product, groups: formattedGroups }

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
