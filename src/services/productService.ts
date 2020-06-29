import { Request, Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { GroupVariant, Image, Parameter, Product, ProductCreateInput, ProductsFiltersInput, ProductUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import StatusError from '../utils/StatusError'

const getProductsQuery: any = db('products as p')
  .select(
    'p.productID',
    'p.title',
    'p.price',
    'p.stock',
    'p.groupID',
    'p.isAvailable',
    'p.vendorID',
    'p.categoryID',
    'v.name as vendorName',
    'c.name as categoryName'
  )
  .avg('stars as stars')
  .count('r.ratingID as ratingCount')
  .leftJoin('ratings as r', 'p.groupID', 'r.groupID')
  .leftJoin('vendors as v', 'p.vendorID', 'v.vendorID')
  .leftJoin('categories as c', 'p.categoryID', 'c.categoryID')
  .groupBy('p.productID', 'vendorName', 'categoryName')

const addProduct = async (productInput: ProductCreateInput, res: Response): Promise<Product> => {
  const { variants, parameters, listPrice, price } = productInput
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const groupID = productInput.groupID
      ? productInput.groupID
      : (await trx('groups').insert({}, [ '*' ]))[0].groupID

    const [ addedProduct ]: Product[] = await trx('products')
      .insert({
        ...R.omit([ 'parameters', 'variants' ], productInput),
        listPrice: listPrice * 100,
        price: price * 100,
        userID: res.locals.userID,
        createdAt: now,
        updatedAt: now,
        groupID
      }, [ '*' ])

    if (variants) {
      await trx('groupVariants')
        .insert(variants.map((gv) => ({
          name: gv.name,
          value: gv.value,
          groupID,
          productID: addedProduct.productID
        })), [ '*' ])
    }

    if (parameters !== undefined && parameters.length !== 0) {
      const { rows: addedParameters }: { rows: Parameter[] } = await trx.raw(
        `? ON CONFLICT ("name")
           DO UPDATE SET
           "name" = EXCLUDED."name"
           RETURNING *;`,
        [
          trx('parameters')
            .insert(parameters.map((p) => ({ name: p.name })))
        ]
      )

      await trx('productParameters')
        .insert(parameters.map((pp) => ({
          value: pp.value,
          parameterID: (addedParameters.find((p) => p.name === pp.name))?.parameterID,
          productID: addedProduct.productID
        })), [ '*' ])
    }
    return addedProduct
  })
}

type ProductListRawData = Pick<Product,
  | 'productID'
  | 'title'
  | 'price'
  | 'stock'
  | 'groupID'
  | 'isAvailable'
  | 'vendorID'
  | 'categoryID'
> & {
  stars: string;
  ratingCount: string;
  vendorName: string;
  categoryName: string;
}

type ProductListData = Omit<ProductListRawData, 'stars' | 'ratingCount'> & {
  stars: number;
  ratingCount: number;
  images: {
    imageID: number;
    index: number;
  }[];
}

export const getProducts = async (productsFiltersinput: ProductsFiltersInput): Promise<ProductListData[]> => {
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
  } = productsFiltersinput

  // TODO refactor reusable queries
  const rawProducts: ProductListRawData[] = await getProductsQuery.clone()

  const images = await db<Image>('images')
    .whereNotNull('productID')

  let products

  products = rawProducts.map((p) => ({
    ...p,
    stars: parseFloat(p.stars),
    ratingCount: parseInt(p.ratingCount)
  }))

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
      .filter((p) => p.vendorName.toLowerCase().includes(vendorName.toLowerCase()))
  }

  if (categoryName !== undefined) {
    products = products
      .filter((p) => p.categoryName.toLowerCase().includes(categoryName.toLowerCase()))
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

  return products.map((p) => {
    const image = images.find((i) => i.productID === p.productID && i.index === 0)
    return {
      ...p,
      images: image !== undefined
        ? [ {
          imageID: image.imageID,
          index: 0,
          productID: p.productID
        } ]
        : []
    }
  })
}

type ProductData = Omit<ProductListData, 'images'> & {
  listPrice: number;
  description: string;
  brandSection: string;
  group: GroupVariant[];
  images: Image[];
}

type ProductAllData = ProductData & Pick<Product, 'createdAt' | 'updatedAt' | 'userID'> & { userEmail: string }

const getProductByID = async (req: Request, res: Response): Promise<ProductData| ProductAllData> => {
  const rawProduct = await getProductsQuery.clone()
    .first(
      'p.listPrice',
      'p.description',
      'p.brandSection',
      'p.createdAt',
      'p.updatedAt',
      'p.userID',
      'p.categoryID',
      'p.vendorID',
      'u.email as userEmail'
    )
    .where('p.productID', req.params.productID)
    .leftJoin('groupVariants as gv', 'p.groupID', 'gv.groupID')
    .leftJoin('users as u', 'p.userID', 'u.userID')
    .groupBy('userEmail')

  if (rawProduct === undefined) throw new StatusError(404, 'Not Found')

  const product = {
    ...rawProduct,
    stars: parseFloat(rawProduct.stars),
    ratingCount: parseInt(rawProduct.ratingCount)
  }

  const groupVariants = await db<GroupVariant>('groupVariants')
    .where('groupID', product.groupID)

  const images = await db<Image>('images')
    .where('productID', product.productID)

  const fullProduct = { ...product, group: groupVariants, images }

  const role: string | undefined = res.locals.userRole

  return role !== undefined && [ 'ROOT', 'ADMIN' ].includes(role)
    ? fullProduct
    : R.omit([
      'createdAt',
      'updatedAt',
      'userID',
      'userEmail'
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

const uploadProductImages = async (files: Express.Multer.File[], req: Request, res: Response): Promise<void> => {
  await dbTrans(async (trx: Knex.Transaction) => {
  // TODO resolve poll bug
  // const images = await trx<Image>('images')
  //   .where('productID', req.params.productID)

    // let indexes: number[] = []

    const filesWithIndexes = files.map((f) => {
      const index = getUploadIndex(f.filename)
      // indexes.push(index)
      return {
        productID: req.params.productID,
        userID: res.locals.userID,
        index
      }
    })

    // if (images.some((i) => indexes.includes(i.index))) throw new StatusError(500, 'Error uploading images')

    const uploadedImages: Image[] = await trx('images')
      .insert(filesWithIndexes, [ '*' ])

    const uploadConfig = {
      fileNames: uploadedImages.map((i) => i.imageID),
      imagesPath: `${imagesBasePath}/images`,
      maxWidth: 1500,
      maxHeight: 1500,
      previewWidth: 425,
      previewHeight: 425,
      thumbWidth: 40,
      thumbHeight: 40
    }
    uploadImages(files, uploadConfig)
  })
}

export default {
  addProduct,
  getProducts,
  getProductByID,
  updateProduct,
  uploadProductImages
}
