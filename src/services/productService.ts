import { Request, Response } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { GroupVariation, Image, Product, ProductCreateInput, ProductsFiltersInput, ProductsMinFiltersInput, ProductUpdateInput, ProductParameter } from '../types'
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
  const { groupVariations, productParameters, listPrice, price } = productInput
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const groupID = productInput.groupID
      ? productInput.groupID
      : (await trx('groups').insert({}, [ '*' ]))[0].groupID

    const [ addedProduct ]: Product[] = await trx('products')
      .insert({
        ...R.omit([ 'productParameters', 'groupVariations' ], productInput),
        listPrice: listPrice !== undefined
          ? listPrice * 100
          : undefined,
        price: price * 100,
        userID: res.locals.userID,
        createdAt: now,
        updatedAt: now,
        groupID
      }, [ '*' ])

    let addedGroupVariations: GroupVariation[] = []

    if (groupVariations !== undefined) {
      addedGroupVariations = await trx('groupVariations')
        .insert(groupVariations.map((gv) => ({
          name: gv.name,
          value: gv.value,
          groupID,
          productID: addedProduct.productID
        })), [ '*' ])
    }

    if (productParameters !== undefined && productParameters.length !== 0) {
      await trx('productParameters')
        .insert(productParameters.map((pp) => (
          { ...pp, productID: addedProduct.productID }
        )))
    }

    return {
      ...addedProduct,
      price: addedProduct.price / 100,
      listPrice: addedProduct.listPrice !== undefined
        ? addedProduct.listPrice / 100
        : undefined,
      group: addedGroupVariations
    }
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

const getProducts = async (productsFiltersinput: ProductsFiltersInput): Promise<ProductListData[]> => {
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
    price: p.price / 100,
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
      .filter((p) => p.price >= priceMin)
  }

  if (priceMax !== undefined) {
    products = products
      .filter((p) => p.price <= priceMax)
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

type ProductMinListData = Pick<ProductListData,
  | 'productID'
  | 'title'
  | 'vendorID'
  | 'categoryID'
  | 'groupID'
  | 'vendorName'
  | 'categoryName'
>

const getProductsMin = async (productsFiltersinput: ProductsMinFiltersInput): Promise<ProductMinListData[]> => {
  const { title } = productsFiltersinput

  let products = await db('products as p')
    .select(
      'p.productID',
      'p.title',
      'p.vendorID',
      'p.groupID',
      'p.categoryID',
      'v.name as vendorName',
      'c.name as categoryName'
    )
    .leftJoin('vendors as v', 'p.vendorID', 'v.vendorID')
    .leftJoin('categories as c', 'p.categoryID', 'c.categoryID')
    .groupBy('p.productID', 'vendorName', 'categoryName')

  if (title !== undefined) {
    products = products
      .filter((p) => p.title.toLowerCase().includes(title.toLowerCase()))
  }

  return products
}

type ProductData = Omit<ProductListData, 'images'> & {
  listPrice?: number;
  description: string;
  brandSection: string;
  group: GroupVariation[];
  images: Image[];
}

type ProductAllData = ProductData & Pick<Product, 'createdAt' | 'updatedAt' | 'userID' | 'listPrice'> & { userEmail: string }

const getProductByID = async (req: Request, res: Response): Promise<ProductData| ProductAllData> => {
  const rawProduct: Omit<ProductAllData, 'stars' | 'ratingCount'> & { stars: string; ratingCount: string } = await getProductsQuery.clone()
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
    .leftJoin('users as u', 'p.userID', 'u.userID')
    .groupBy('userEmail')

  if (rawProduct === undefined) throw new StatusError(404, 'Not Found')

  const product = {
    ...rawProduct,
    price: rawProduct.price / 100,
    listPrice: rawProduct.listPrice !== undefined
      ? rawProduct.listPrice / 100
      : undefined,
    stars: parseFloat(rawProduct.stars),
    ratingCount: parseInt(rawProduct.ratingCount)
  }

  const groupVariations = await db<GroupVariation>('groupVariations')
    .where('groupID', product.groupID)

  const images = await db<Image>('images')
    .where('productID', product.productID)

  const fullProduct = { ...product, group: groupVariations, images }

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

type GroupVariationMin = Pick<GroupVariation, 'name' | 'value'>
type ProductParameterMin = Pick<ProductParameter, 'parameterID' | 'value'>

const updateProduct = async (productInput: ProductUpdateInput, req: Request): Promise<Product> => {
  const { groupID, groupVariations, productParameters, listPrice, price } = productInput
  const productID = Number(req.params.productID)

  return await dbTrans(async (trx: Knex.Transaction) => {
    const [ updatedProduct ]: Product[] = await trx('products')
      .update({
        ...R.omit([ 'productParameters', 'groupVariations' ], productInput),
        price: price !== undefined
          ? price * 100
          : undefined,
        listPrice: listPrice !== undefined
          ? listPrice * 100
          : undefined,
        updatedAt: new Date()
      }, [ '*' ])
      .where('productID', productID)

    if (updatedProduct === undefined) throw new StatusError(404, 'Not Found')

    let processedGroupVariations: GroupVariation[] = []

    if (groupVariations !== undefined) {
      const allGroupVariations = await trx<GroupVariation>('groupVariations')
        .where('groupID', groupID)
        .andWhere('productID', productID)

      let groupVariationsToInsert: GroupVariationMin[] = []
      let groupVariationsToUpdate: GroupVariationMin[] = []

      console.info('allGroupVariations', allGroupVariations)

      groupVariations.forEach((gv) => {
        allGroupVariations.length !== 0 && allGroupVariations.find((agv) =>
          agv.groupID === groupID &&
          agv.name === gv.name &&
          agv.productID === productID
        )
          ? groupVariationsToUpdate.push(gv)
          : groupVariationsToInsert.push(gv)
      })

      console.info('groupVariationsToUpdate', groupVariationsToUpdate)
      console.info('groupVariationsToInsert', groupVariationsToInsert)

      let addedGroupVariations: GroupVariation[] = []
      let updatedGroupVariations: GroupVariation[][] = []

      if (groupVariationsToInsert.length !== 0) {
        addedGroupVariations = await trx('groupVariations')
          .insert(groupVariationsToInsert.map((gv) => ({
            name: gv.name,
            value: gv.value,
            groupID,
            productID
          })), [ '*' ])
      }

      if (groupVariationsToUpdate.length !== 0) {
        updatedGroupVariations = await Promise
          .all(groupVariationsToUpdate.map(async (gv) =>
            await trx('groupVariations')
              .update({ name: gv.name, value: gv.value }, [ '*' ])
              .where('productID', productID)
              .andWhere('groupID', groupID)
              .andWhere('name', gv.name)
          ))
      }

      processedGroupVariations = [
        ...addedGroupVariations,
        ...R.flatten(updatedGroupVariations)
      ]
    }

    if (productParameters !== undefined) {
      const allProductParameters = await trx<ProductParameter>('productParameters')
        .andWhere('productID', productID)

      let productParametersToInsert: ProductParameterMin[] = []
      let productParametersToUpdate: ProductParameterMin[] = []

      productParameters.forEach((pp) => {
        allProductParameters.find((app) =>
          app.parameterID === pp.parameterID &&
          app.productID === productID
            ? productParametersToUpdate.push(pp)
            : productParametersToInsert.push(pp)
        )
      })

      await trx('productParameters')
        .insert(productParametersToInsert.map((pp) => ({
          value: pp.value,
          parameterID: pp.parameterID,
          productID
        })), [ '*' ])

      await Promise
        .all(productParametersToUpdate.map(async (pp) =>
          await trx('productParameters')
            .update({ value: pp.value }, [ '*' ])
            .where('productID', productID)
            .andWhere('parameterID', pp.parameterID)
        ))
    }

    return {
      ...updatedProduct,
      price: updatedProduct.price / 100,
      listPrice: updatedProduct.listPrice !== undefined
        ? updatedProduct.listPrice / 100
        : undefined,
      group: processedGroupVariations
    }
  })
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
  getProductsMin,
  getProductByID,
  updateProduct,
  uploadProductImages
}
