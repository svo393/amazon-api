import { Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import R from 'ramda'
import sharp from 'sharp'
import { ProductPublicData, ProductCreateInput } from '../types'
import { makeID } from '../utils'
import StatusError from '../utils/StatusError'

const productFieldSet = {
  questions: true,
  ratings: true,
  productParameters: true,
  groupProducts: true
}

const addProduct = async (productInput: ProductCreateInput): Promise<ProductPublicData> => {
  const category = await prisma.category.upsert({
    where: { name: productInput.categoryName },
    update: { name: productInput.categoryName },
    create: { name: productInput.categoryName },
    select: { name: true }
  })

  const vendor = await prisma.vendor.upsert({
    where: { name: productInput.vendorName },
    update: { name: productInput.vendorName },
    create: { name: productInput.vendorName },
    select: { name: true }
  })

  const brandSection = await prisma.brandSection.create({
    data: { content: productInput.brandSection },
    select: { id: true }
  })

  const addedProduct = await prisma.product.create({
    data: {
      ...R.omit([
        'groups',
        'productParameters',
        'categoryName',
        'vendorName',
        'userID',
        'brandSection'
      ], productInput),
      id,
      brandSection: { connect: { id: brandSection.id } },
      user: { connect: { id: productInput.userID } },
      category: { connect: { name: category.name } },
      vendor: { connect: { name: vendor.name } }
    },
    include: productFieldSet
  })

  productInput.productParameters.map(async (p) => {
    const parameter = await prisma.parameter.upsert({
      where: { name: p.name },
      update: { name: p.name },
      create: { name: p.name },
      select: { name: true }
    })

    await prisma.productParameter.create({
      data: {
        value: p.value,
        product: { connect: { id } },
        parameter: { connect: { name: parameter.name } }
      }
    })
  })

  productInput.groups.map(async (i) => {
    let group: { id: string }

    if (i.productID) {
      const groupProducts = await prisma.groupProduct.findMany({
        where: { productID: i.productID },
        select: { group: true }
      })

      const targetGroup = groupProducts.find((gi) => gi.group.name === i.name)
      if (!targetGroup) throw new StatusError(400, 'Invalid Group')

      group = targetGroup.group
    } else {
      group = await prisma.group.create({
        data: { name: i.name },
        select: { id: true }
      })
    }

    await prisma.groupProduct.create({
      data: {
        value: i.value,
        product: { connect: { id } },
        group: { connect: { id: group.id } }
      }
    })
  })

  await prisma.disconnect()

  const productData = R.omit([
    'createdAt',
    'updatedAt',
    'userID'
  ], addedProduct)

  return productData
}

// const getProducts = async (): Promise<ProductPublicData[]> => {
//   const products = await prisma.product.findMany({
//     include: productFieldSet
//   })
//   await prisma.disconnect()
//   return products
// }

// const getProductByID = async (id: string, res: Response): Promise<ProductPublicData| ProductAllData> => {
//   const product = await prisma.product.findOne({
//     where: { id },
//     include: productFieldSet
//   })
//   await prisma.disconnect()

//   if (!product) throw new StatusError(404, 'Not Found')

//   const role = res.locals.userRole
//   const userIsAdminOrRoot = role === 'ADMIN' || role === 'ROOT'

//   const productData = userIsAdminOrRoot
//     ? product
//     : R.omit([
//       'createdAt',
//       'updatedAt',
//       'userID'
//     ], product)
//   return productData
// }

// const updateProduct = async (productInput: ProductUpdateInput, id: string): Promise<Product> => {
//   const updatedProduct = await prisma.product.update({
//     where: { id },
//     data: productInput
//   })
//   await prisma.disconnect()

//   if (!updatedProduct) throw new StatusError(404, 'Not Found')
//   return updatedProduct
// }

// const storage = multer.diskStorage({
//   destination: './tmp',
//   filename (_req, file, cb) { cb(null, file.originalname) }
// })

// const imagePath = './public/uploads'
// const maxWidth = 1500
// const maxHeight = 1500
// const previewWidth = 450
// const previewHeight = 450
// const thumbWidth = 40
// const thumbHeight = 40

// const multerUpload = multer({ storage })

// const uploadImages = (files: Express.Multer.File[], id: string): void => {
//   files.map(async (file, index) => {
//     const image = sharp(file.path)
//     const info = await image.metadata()
//     const fileName = `${id}_${index}`

//     if ((info.width as number) > maxWidth || (info.height as number) > maxHeight) {
//       await image
//         .resize(maxWidth, maxHeight, { fit: 'inside' })
//         .jpeg({ progressive: true })
//         .toFile(
//           path.resolve(imagePath, `${fileName}_${maxWidth}.jpg`)
//         )

//       await image
//         .resize(maxWidth, maxHeight, { fit: 'inside' })
//         .webp()
//         .toFile(
//           path.resolve(imagePath, `${fileName}_${maxWidth}.webp`)
//         )
//     } else {
//       await image
//         .jpeg({ progressive: true })
//         .toFile(
//           path.resolve(imagePath, `${fileName}_${maxWidth}.jpg`)
//         )

//       await image
//         .webp()
//         .toFile(
//           path.resolve(imagePath, `${fileName}_${maxWidth}.webp`)
//         )
//     }

//     await image
//       .resize(previewWidth, previewHeight, { fit: 'inside' })
//       .jpeg({ progressive: true })
//       .toFile(
//         path.resolve(imagePath, `${fileName}_${previewWidth}.jpg`)
//       )

//     await image
//       .resize(previewWidth, previewHeight, { fit: 'inside' })
//       .webp()
//       .toFile(
//         path.resolve(imagePath, `${fileName}_${previewWidth}.webp`)
//       )

//     await image
//       .resize(thumbWidth, thumbHeight, { fit: 'inside' })
//       .jpeg({ progressive: true })
//       .toFile(
//         path.resolve(imagePath, `${fileName}_${thumbWidth}.jpg`)
//       )

//     await image
//       .resize(thumbWidth, thumbHeight, { fit: 'inside' })
//       .webp()
//       .toFile(
//         path.resolve(imagePath, `${fileName}_${thumbWidth}.webp`)
//       )

//     fs.unlinkSync(file.path)
//   })
// }

export default {
  addProduct,
  getProducts,
  getProductByID,
  updateProduct,
  multerUpload,
  uploadImages
}
