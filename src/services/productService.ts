import { Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import R from 'ramda'
import sharp from 'sharp'
import { Product, ProductAllData, ProductCreateInput, ProductListData, ProductPublicData, ProductUpdateInput, Group, GroupProduct } from '../types'
import { db } from '../utils/db'
import { getProductsQuery } from '../utils/queries'
import StatusError from '../utils/StatusError'

const addProduct = async (productInput: ProductCreateInput, res: Response): Promise<ProductPublicData> => {
  const now = new Date()

  const [ addedProduct ]: Product[] = await db<Product>('products')
    .insert({
      ...productInput,
      userID: res.locals.userID,
      productCreatedAt: now,
      productUpdatedAt: now
    }, [ '*' ])

  // productInput.productParameters.map(async (p) => { // TODO
  //   const parameter = await prisma.parameter.upsert({
  //     where: { name: p.name },
  //     update: { name: p.name },
  //     create: { name: p.name },
  //     select: { name: true }
  //   })

  //   await prisma.productParameter.create({
  //     data: {
  //       value: p.value,
  //       product: { connect: { id } },
  //       parameter: { connect: { name: parameter.name } }
  //     }
  //   })
  // })

  // productInput.groups.map(async (i) => {
  //   let group: { id: string }

  //   if (i.productID) {
  //     const groupProducts = await prisma.groupProduct.findMany({
  //       where: { productID: i.productID },
  //       select: { group: true }
  //     })

  //     const targetGroup = groupProducts.find((gi) => gi.group.name === i.name)
  //     if (!targetGroup) throw new StatusError(400, 'Invalid Group')

  //     group = targetGroup.group
  //   } else {
  //     group = await prisma.group.create({
  //       data: { name: i.name },
  //       select: { id: true }
  //     })
  //   }

  //   await prisma.groupProduct.create({
  //     data: {
  //       value: i.value,
  //       product: { connect: { id } },
  //       group: { connect: { id: group.id } }
  //     }
  //   })
  // })

  return R.omit([
    'productCreatedAt',
    'productUpdatedAt',
    'userID'
  ], addedProduct)
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

  console.info('groups', groups)

  const groupsFormatted = groups.reduce((acc, cur) => {
    return acc[cur.name]
      ? { ...acc, [cur.name]: [ ...acc[cur.name], cur ] }
      : { ...acc, [cur.name]: [ cur ] }
  }, {})

  const fullProduct = {
    ...product,
    groups: groupsFormatted
  }

  const role: string | undefined = res.locals.userRole
  const hasPermission = role && [ 'ROOT', 'ADMIN' ].includes(role)

  return hasPermission
    ? fullProduct
    : R.omit([
      'productCreatedAt',
      'productUpdatedAt',
      'userID'
    ], fullProduct)
}

const updateProduct = async (productInput: ProductUpdateInput, req: Request): Promise<Product> => {
  const [ updatedProduct ]: Product[] = await db<Product>('products')
    .update({ ...productInput }, [ '*' ])
    .where('productID', req.params.productID)

  if (!updatedProduct) throw new StatusError(404, 'Not Found')
  return updatedProduct
}

const storage = multer.diskStorage({
  destination: './tmp',
  filename (_req, file, cb) { cb(null, file.originalname) }
})

const imagePath = './public/uploads'
const maxWidth = 1500
const maxHeight = 1500
const previewWidth = 450
const previewHeight = 450
const thumbWidth = 40
const thumbHeight = 40

const multerUpload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if ([ 'image/png', 'image/jpg', 'image/jpeg', 'image/webp' ].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new StatusError(400, 'Only .png, .jpg, .jpeg and .webp formats allowed'))
    }
  }
})

const uploadImages = (files: Express.Multer.File[], req: Request): void => {
  files.map(async (file, index) => {
    const image = sharp(file.path)
    const info = await image.metadata()
    const fileName = `${req.params.productID}_${index}`

    if ((info.width as number) > maxWidth || (info.height as number) > maxHeight) {
      await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagePath, `${fileName}_${maxWidth}.jpg`)
        )

      await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .webp()
        .toFile(
          path.resolve(imagePath, `${fileName}_${maxWidth}.webp`)
        )
    } else {
      await image
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagePath, `${fileName}_${maxWidth}.jpg`)
        )

      await image
        .webp()
        .toFile(
          path.resolve(imagePath, `${fileName}_${maxWidth}.webp`)
        )
    }

    await image
      .resize(previewWidth, previewHeight, { fit: 'inside' })
      .jpeg({ progressive: true })
      .toFile(
        path.resolve(imagePath, `${fileName}_${previewWidth}.jpg`)
      )

    await image
      .resize(previewWidth, previewHeight, { fit: 'inside' })
      .webp()
      .toFile(
        path.resolve(imagePath, `${fileName}_${previewWidth}.webp`)
      )

    await image
      .resize(thumbWidth, thumbHeight, { fit: 'inside' })
      .jpeg({ progressive: true })
      .toFile(
        path.resolve(imagePath, `${fileName}_${thumbWidth}.jpg`)
      )

    await image
      .resize(thumbWidth, thumbHeight, { fit: 'inside' })
      .webp()
      .toFile(
        path.resolve(imagePath, `${fileName}_${thumbWidth}.webp`)
      )

    fs.unlinkSync(file.path)
  })
}

export default {
  addProduct,
  getProducts,
  getProductByID,
  updateProduct,
  multerUpload,
  uploadImages
}
