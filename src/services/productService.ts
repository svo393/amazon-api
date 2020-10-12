import { Request } from 'express'
import Knex from 'knex'
import { flatten, omit, sum } from 'ramda'
import { BatchWithCursor, GroupVariation, HistoryInput, Image, Product, ProductCreateInput, ProductData, ProductParameter, ProductsFiltersInput, ProductSize, ProductsMinFiltersInput, ProductUpdateInput, Question, Review, User } from '../types'
import { defaultLimit, imagesBasePath } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import getUploadIndex from '../utils/getUploadIndex'
import { uploadImages } from '../utils/img'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

export const getProductsQuery: any = db('products as p')
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
  .leftJoin('reviews as r', 'p.groupID', 'r.groupID')
  .leftJoin('vendors as v', 'p.vendorID', 'v.vendorID')
  .leftJoin('categories as c', 'p.categoryID', 'c.categoryID')
  .where('r.moderationStatus', 'APPROVED')
  .groupBy('p.productID', 'vendorName', 'categoryName')

const addProduct = async (productInput: ProductCreateInput, req: Request): Promise<ProductData> => {
  const { productSizes, groupVariations, productParameters, listPrice, price } = productInput
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const groupID = productInput.groupID
      ? productInput.groupID
      : (await trx('groups').insert({}, [ '*' ]))[0].groupID

    productSizes !== undefined && delete productInput.stock

    const [ addedProduct ]: Product[] = await trx('products')
      .insert({
        ...omit([ 'productParameters', 'groupVariations', 'productSizes' ], productInput),
        listPrice: listPrice !== undefined
          ? Math.round(listPrice * 100)
          : undefined,
        price: Math.round(price * 100),
        userID: req.session?.userID,
        createdAt: now,
        updatedAt: now,
        groupID
      }, [ '*' ])

    let addedProductSizes: ProductSize[] = []

    if (productSizes !== undefined) {
      addedProductSizes = await trx('productSizes')
        .insert(productSizes.map((ps) => ({
          name: ps.name,
          qty: ps.qty,
          productID: addedProduct.productID
        })), [ '*' ])
    }

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
      listPrice: addedProduct.listPrice !== null
        ? addedProduct.listPrice / 100
        : null,
      group: addedGroupVariations,
      productSizes: addedProductSizes
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
  reviewCount: string;
  vendorName: string;
  categoryName: string;
  ratingStats?: { [ k: number ]: number };
}

type ProductListData = Omit<ProductListRawData, 'stars' | 'reviewCount'> & {
  stars: number;
  reviewCount: number;
  group?: GroupVariation[];
  images: {
    imageID: number;
    index: number;
  }[];
  productSizes: ProductSize[];
  productSizesSum: number | null;
}

const getProducts = async (productsFiltersInput: ProductsFiltersInput, req: Request): Promise<BatchWithCursor<ProductListData>> => {
  const {
    page = 1,
    sortBy = 'groupID',
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
    reviewMax,
    reviewMin,
    reviewCountPerProduct
  } = productsFiltersInput

  const rawProducts: ProductListRawData[] = groupID !== undefined
    ? await getProductsQuery.clone()
      .where('p.groupID', groupID)
    : await getProductsQuery.clone()

  const productIDs = rawProducts.map(({ productID }) => productID)

  let groupVariations: GroupVariation[]

  const images = await db<Image>('images')
    .whereNotNull('productID')
    .andWhere('index', 0)

  let ratingStats: { stars: number; count: string }[]

  const productSizes = await db<ProductSize>('productSizes')
    .whereIn('productID', productIDs)

  let products: Omit<ProductListData, 'images'>[]

  const reviewCountProp = reviewCountPerProduct ? 'productID' : 'groupID'

  products = await Promise.all(rawProducts.map(async (p) => {
    const sizesSum = sum(productSizes
      .filter((ps) => ps.productID === p.productID)
      .map(({ qty }) => qty)
    )

    const reviews = await db<Review>('reviews')
      .select('moderationStatus')
      .andWhere(reviewCountProp, p[reviewCountProp])

    const hasPermission = [ 'ROOT', 'ADMIN' ].includes(req.session?.role)

    return {
      ...p,
      price: p.price / 100,
      stars: parseFloat(p.stars),
      reviewCount: hasPermission
        ? reviews.length
        : reviews.filter((r) => r.moderationStatus === 'APPROVED').length,
      productSizes: productSizes.filter((ps) => ps.productID === p.productID),
      productSizesSum: sizesSum || null
    }
  }))

  if (groupID !== undefined) {
    ratingStats = await db('reviews')
      .select('stars')
      .count('stars')
      .where('groupID', groupID)
      .andWhere('moderationStatus', 'APPROVED')
      .groupBy('stars')

    groupVariations = await db<GroupVariation>('groupVariations')
      .where('groupID', groupID)

    products = products
      .filter((p) => p.groupID === groupID)
      .map((p) => ({
        ...p,
        group: groupVariations,
        ratingStats: ratingStats.reduce((acc, cur) => {
          acc[cur.stars] = Number(cur.count)
          return acc
        }, {} as { [ k: number ]: number })
      }))
  }

  if (priceMin !== undefined) {
    products = products
      .filter((p) => p.price >= priceMin)
  }

  if (priceMax !== undefined) {
    products = products
      .filter((p) => p.price <= priceMax)
  }

  if (stockMin !== undefined) {
    products = products
      .filter((p) =>
        p.stock != null
          ? p.stock >= stockMin
          : p.productSizesSum !== null && p.productSizesSum >= stockMin
      )
  }

  if (stockMax !== undefined) {
    products = products
      .filter((p) =>
        p.stock != null
          ? p.stock <= stockMax
          : p.productSizesSum !== null && p.productSizesSum <= stockMax
      )
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

  if (reviewMin !== undefined) {
    products = products
      .filter((p) => p.reviewCount >= reviewMin)
  }

  if (reviewMax !== undefined) {
    products = products
      .filter((p) => p.reviewCount <= reviewMax)
  }

  if (title !== undefined) {
    products = products
      .filter((_, i) =>
        fuseIndexes(products, [ 'title' ], title).includes(i))
  }

  if (vendorName !== undefined) {
    products = products
      .filter((_, i) =>
        fuseIndexes(products, [ 'vendorName' ], vendorName).includes(i))
  }

  if (categoryName !== undefined) {
    products = products
      .filter((_, i) =>
        fuseIndexes(products, [ 'categoryName' ], categoryName).includes(i))
  }

  const productsSorted = sortItems(products, sortBy)
    .slice((page - 1) * defaultLimit, (page - 1) * defaultLimit + defaultLimit)

  const batch = productsSorted.map((p) => {
    const image = images.find((i) => i.productID === p.productID)
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

  const totalCount = products.length
  const end = (page - 1) * defaultLimit + defaultLimit

  return { batch, totalCount, hasNextPage: end < totalCount }
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
      .filter((_, i) =>
        fuseIndexes(products, [ 'title' ], title).includes(i))
  }

  return products
}

type HistoryProduct = {
  productID: number
  title: string
  imageID: number
}

const getHistoryProducts = async ({ items }: HistoryInput): Promise<{ batch: Partial<Product>[] }> => {
  const products: HistoryProduct[] = await db('products as p')
    .select('p.productID', 'title', 'i.imageID')
    .whereIn('p.productID', items)
    .leftJoin('images as i', 'p.productID', 'i.productID')
    .where('i.index', 0)

  const images = await db<Image>('images')
    .whereIn('productID', items)

  return {
    batch: products.map((p) => ({
      ...omit([ 'imageID' ], p),
      images: images.filter((i) => i.productID === p.productID)
    }))
  }
}

type ProductLimitedData = Omit<ProductListData, 'images'> & {
  listPrice?: number;
  questionCount: number;
  bullets: string;
  description?: string;
  group: GroupVariation[];
  productSizes: ProductSize[];
  images: Image[];
  createdAt: Date;
  ratingStats: { [ k: number ]: number };
}

type ProductAllData = ProductLimitedData &
Pick<ProductData, 'createdAt' | 'updatedAt' | 'userID' | 'listPrice'> & {
   author: Pick<User, 'name' | 'userID' | 'avatar'> & { email?: string };
  }

type RawProduct = Omit<ProductAllData, 'stars' | 'reviewCount | questionCount'> & { stars: string; reviewCount: string; questionCount: string; avatar: boolean; userName: string; userEmail: string }

const getProductByID = async ({ reviewCountPerProduct }: { reviewCountPerProduct?: true }, req: Request): Promise<ProductLimitedData| ProductAllData> => {
  const rawProduct: RawProduct = await getProductsQuery.clone()
    .first(
      'p.listPrice',
      'p.productID',
      'p.groupID',
      'p.price',
      'p.bullets',
      'p.description',
      'p.createdAt',
      'p.updatedAt',
      'p.userID',
      'p.categoryID',
      'p.vendorID',
      'u.avatar',
      'u.name as userName',
      'u.email as userEmail'
    )
    .where('p.productID', req.params.productID)
    .leftJoin('users as u', 'p.userID', 'u.userID')
    .leftJoin('questions as q', 'p.groupID', 'q.groupID')
    .groupBy('u.userID', 'q.questionID')

  if (rawProduct === undefined) throw new StatusError(404, 'Not Found')

  const reviewCountProp = reviewCountPerProduct ? 'productID' : 'groupID'

  const reviews = await db<Review>('reviews')
    .select('moderationStatus')
    .andWhere(reviewCountProp, rawProduct[reviewCountProp])

  const questions = await db<Review>('questions')
    .select('moderationStatus')
    .andWhere('groupID', rawProduct.groupID)

  const _questions: (Pick<Question, 'moderationStatus'> & { answerCount: string })[] = await db('questions as q')
    .select('q.moderationStatus')
    .count('a.questionID as answerCount')
    .where('groupID', rawProduct.groupID)
    .andWhere('a.moderationStatus', 'APPROVED')
    .leftJoin('answers as a', 'q.questionID', 'a.questionID')
    .groupBy('q.questionID')

  const ratingStats: { stars: number; count: string }[] = await db('reviews')
    .select('stars')
    .count('stars')
    .where('groupID', rawProduct.groupID)
    .andWhere('moderationStatus', 'APPROVED')
    .groupBy('stars')

  const hasPermission = [ 'ROOT', 'ADMIN' ].includes(req.session?.role)

  const product = {
    ...rawProduct,
    price: rawProduct.price / 100,
    listPrice: rawProduct.listPrice !== null
      ? rawProduct.listPrice / 100
      : null,
    stars: parseFloat(rawProduct.stars),
    reviewCount: hasPermission
      ? reviews.length
      : reviews.filter((r) => r.moderationStatus === 'APPROVED').length,
    questionCount: hasPermission
      ? questions.length
      : _questions.filter((q) => Number(q.answerCount) !== 0).length,
    ratingStats: ratingStats.reduce((acc, cur) => {
      acc[cur.stars] = Number(cur.count)
      return acc
    }, {} as { [ k: number ]: number })
  }

  const groupVariations = await db<GroupVariation>('groupVariations')
    .where('groupID', product.groupID)

  const images = await db<Image>('images')
    .where('productID', product.productID)

  const productSizes = await db<ProductSize>('productSizes')
    .where('productID', product.productID)

  const productParameters = await db('productParameters as pp')
    .join('parameters as p', 'pp.parameterID', 'p.parameterID')
    .where('pp.productID', product.productID)

  const fullProduct = {
    ...(omit([ 'userName', 'userEmail', 'avatar', 'userID' ], product) as ProductAllData),
    group: groupVariations,
    images,
    productSizes,
    productParameters,
    author: {
      avatar: product.avatar,
      name: product.userName,
      email: product.userEmail,
      userID: product.userID
    }
  }

  return [ 'ROOT', 'ADMIN' ].includes(req.session?.role)
    ? fullProduct
    : omit([
      'updatedAt',
      'author'
    ], fullProduct)
}

type GroupVariationMin = Pick<GroupVariation, 'name' | 'value'>
type ProductParameterMin = Pick<ProductParameter, 'parameterID' | 'value'>
type ProductSizeMin = Pick<ProductSize, 'name' | 'qty'>

const updateProduct = async (productInput: ProductUpdateInput, req: Request): Promise<ProductData> => {
  const { productSizes, groupID, groupVariations, productParameters, listPrice, price, stock } = productInput
  const productID = Number(req.params.productID)

  return await dbTrans(async (trx: Knex.Transaction) => {
    const [ updatedProduct ]: Product[] = await trx('products')
      .update({
        ...omit([ 'productParameters', 'groupVariations', 'productSizes' ], productInput),
        price: price !== undefined
          ? Math.round(price * 100)
          : undefined,
        listPrice: listPrice !== undefined
          ? Math.round(listPrice * 100)
          : undefined,
        updatedAt: new Date()
      }, [ '*' ])
      .where('productID', productID)

    if (updatedProduct === undefined) throw new StatusError(404, 'Not Found')

    let processedProductSizes: ProductSize[] = []

    if (stock !== undefined && productSizes === undefined) {
      await trx('productSizes')
        .del()
        .andWhere('productID', productID)
    } else if (productSizes !== undefined) {
      const allProductSizes = await trx<ProductSize>('productSizes')
        .where('productID', productID)

      let productSizesToDelete: string[] = []

      allProductSizes.forEach((app) => {
        !productSizes?.find((pp) =>
          pp.name === app.name && app.productID === productID
        ) && productSizesToDelete.push(app.name)
      })

      await trx('productSizes')
        .del()
        .whereIn('name', productSizesToDelete)
        .andWhere('productID', productID)

      let productSizesToInsert: ProductSizeMin[] = []
      let productSizesToUpdate: ProductSizeMin[] = []

      productSizes.forEach((ps) => {
        allProductSizes.length !== 0 && allProductSizes.find((agv) =>
          agv.name === ps.name &&
          agv.productID === productID
        )
          ? productSizesToUpdate.push(ps)
          : productSizesToInsert.push(ps)
      })

      let addedProductSizes: ProductSize[] = []
      let updatedProductSizes: ProductSize[][] = []

      if (productSizesToInsert.length !== 0) {
        addedProductSizes = await trx('productSizes')
          .insert(productSizesToInsert.map((ps) => ({
            name: ps.name,
            qty: ps.qty,
            productID
          })), [ '*' ])
      }

      if (productSizesToUpdate.length !== 0) {
        updatedProductSizes = await Promise
          .all(productSizesToUpdate.map(async (ps) =>
            await trx('productSizes')
              .update({ name: ps.name, qty: ps.qty }, [ '*' ])
              .where('productID', productID)
              .andWhere('name', ps.name)
          ))
      }

      processedProductSizes = [
        ...addedProductSizes,
        ...flatten(updatedProductSizes)
      ]
    }

    let processedGroupVariations: GroupVariation[] = []

    if (groupVariations !== undefined) {
      const allGroupVariations = await trx<GroupVariation>('groupVariations')
        .where('groupID', groupID)
        .andWhere('productID', productID)

      let groupVariationsToInsert: GroupVariationMin[] = []
      let groupVariationsToUpdate: GroupVariationMin[] = []

      groupVariations.forEach((gv) => {
        allGroupVariations.length !== 0 && allGroupVariations.find((agv) =>
          agv.groupID === groupID &&
          agv.name === gv.name &&
          agv.productID === productID
        )
          ? groupVariationsToUpdate.push(gv)
          : groupVariationsToInsert.push(gv)
      })

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
        ...flatten(updatedGroupVariations)
      ]
    }

    if (productParameters !== undefined) {
      const allProductParameters = await trx<ProductParameter>('productParameters')
        .andWhere('productID', productID)

      let productParametersToDelete: number[] = []

      allProductParameters.forEach((app) => {
        !productParameters?.find((pp) => pp.parameterID === app.parameterID) &&
          productParametersToDelete.push(app.parameterID)
      })

      await trx('productParameters')
        .del()
        .whereIn('parameterID', productParametersToDelete)
        .andWhere('productID', productID)

      let productParametersToInsert: ProductParameterMin[] = []
      let productParametersToUpdate: ProductParameterMin[] = []

      productParameters.forEach((pp) => {
        allProductParameters.length !== 0 && allProductParameters.find((app) =>
          app.parameterID === pp.parameterID &&
          app.productID === productID
        )
          ? productParametersToUpdate.push(pp)
          : productParametersToInsert.push(pp)
      })

      if (productParametersToInsert.length !== 0) {
        await trx('productParameters')
          .insert(productParametersToInsert.map((pp) => ({
            value: pp.value,
            parameterID: pp.parameterID,
            productID
          })), [ '*' ])
      }

      if (productParametersToUpdate.length !== 0) {
        await Promise
          .all(productParametersToUpdate.map(async (pp) =>
            await trx('productParameters')
              .update({ value: pp.value }, [ '*' ])
              .where('productID', productID)
              .andWhere('parameterID', pp.parameterID)
          ))
      }
    }

    return {
      ...updatedProduct,
      price: updatedProduct.price / 100,
      listPrice: updatedProduct.listPrice !== null
        ? updatedProduct.listPrice / 100
        : null,
      group: processedGroupVariations,
      productSizes: processedProductSizes
    }
  })
}

const uploadProductImages = async (files: Express.Multer.File[], req: Request): Promise<void> => {
  await dbTrans(async (trx: Knex.Transaction) => {
    const images = await trx<Image>('images')
      .where('productID', req.params.productID)

    let indexes: number[] = []

    const filesWithIndexes = files.map((f) => {
      const index = getUploadIndex(f.filename)
      indexes.push(index)
      return {
        productID: req.params.productID,
        userID: req.session?.userID,
        index
      }
    })

    if (images.some((i) => indexes.includes(i.index))) throw new StatusError(500, 'Error uploading images')

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
  getHistoryProducts,
  getProductByID,
  updateProduct,
  uploadProductImages
}
