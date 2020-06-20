import { Request, Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { GroupVariant, Image, Parameter, Product, ProductCreateInput, ProductsFiltersInput, ProductUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import { uploadImages } from '../utils/img'
import { getProductsQuery } from '../utils/queries'
import StatusError from '../utils/StatusError'

const addProduct = async (productInput: ProductCreateInput, res: Response): Promise<Product> => {
  const { variants, parameters } = productInput
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

type ProductListData = Pick<Product,
  | 'productID'
  | 'title'
  | 'price'
  | 'stock'
  | 'groupID'
  | 'isAvailable'
> & {
  stars: number;
  ratingCount: number;
  vendorName: string;
  categoryName: string;
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
  let products: (Omit<ProductListData, 'images'> & { imageID: number })[] = await getProductsQuery.clone()
    .select('i.imageID')
    .join('images as i', 'p.productID', 'i.productID')
    .where('i.index', 0)
    .groupBy('i.imageID')

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

  return products.map((p) => {
    const imageID = p.imageID
    delete p.imageID
    return {
      ...p,
      images: [ {
        imageID,
        index: 0,
        productID: p.productID
      } ]
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
  const [ product ] = await getProductsQuery.clone()
    .select(
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

  if (product === undefined) throw new StatusError(404, 'Not Found')

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
  // TODO resolve poll bug
  // const images = await db<Image>('images')
  //   .where('productID', req.params.productID)

  // let indexes: number[] = []

  const filesWithIndexes = files.map((f) => {
    const match = /(?<=_)\d+(?=\.)/.exec(f.filename)
    if (!match) throw new StatusError(400, 'Invalid image filename')
    const index = Number(match[0])
    // indexes.push(index)
    return {
      productID: req.params.productID,
      userID: res.locals.userID,
      index
    }
  })

  // if (images.some((i) => indexes.includes(i.index))) throw new StatusError(500, 'Error uploading images')

  const uploadedImages: Image[] = await db('images')
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
  uploadImages(files, req, uploadConfig)
}

export default {
  addProduct,
  getProducts,
  getProductByID,
  updateProduct,
  uploadProductImages
}
