import { Item, ItemUpdateInput, PrismaClient } from '@prisma/client'
import { Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import R from 'ramda'
import sharp from 'sharp'
import { ItemAllData, ItemCreateInputRaw, ItemPublicData } from '../types'
import { makeID } from '../utils'
import { getUserRole } from '../utils/shield'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

const itemFieldSet = {
  questions: true,
  ratings: true
}

const addItem = async (itemInput: ItemCreateInputRaw): Promise<ItemPublicData> => {
  const items = await prisma.item.findMany({ select: { id: true } })
  const itemIDs = items.map((item) => item.id)
  let id = makeID(7)
  while (itemIDs.includes(id)) { id = makeID(7) }

  const category = await prisma.category.upsert({
    where: { name: itemInput.categoryName },
    update: { name: itemInput.categoryName },
    create: { name: itemInput.categoryName },
    select: { id: true }
  })

  const vendor = await prisma.vendor.upsert({
    where: { name: itemInput.vendorName },
    update: { name: itemInput.vendorName },
    create: { name: itemInput.vendorName },
    select: { id: true }
  })

  const addedItem = await prisma.item.create({
    data: {
      ...itemInput,
      id,
      user: { connect: { id: itemInput.userID } },
      category: { connect: { id: category.id } },
      vendor: { connect: { id: vendor.id } }
    },
    include: itemFieldSet
  })

  await prisma.disconnect()

  const itemData = R.omit([
    'createdAt',
    'updatedAt',
    'userID'
  ], addedItem)

  return itemData
}

const getItems = async (): Promise<ItemPublicData[]> => {
  const items = await prisma.item.findMany({
    include: itemFieldSet
  })
  await prisma.disconnect()
  return items
}

const getItemByID = async (id: string, res: Response): Promise<ItemPublicData| ItemAllData> => {
  const item = await prisma.item.findOne({
    where: { id },
    include: itemFieldSet
  })
  await prisma.disconnect()

  if (!item) { throw new StatusError(404, 'Not Found') }

  const role = await getUserRole(res)
  const userIsAdminOrRoot = role === 'ADMIN' || role === 'ROOT'

  const itemData = userIsAdminOrRoot
    ? item
    : R.omit([
      'createdAt',
      'updatedAt',
      'userID'
    ], item)

  return itemData
}

const updateItem = async (itemInput: ItemUpdateInput, id: string): Promise<Item> => {
  const updatedItem = await prisma.item.update({
    where: { id },
    data: itemInput
  })
  await prisma.disconnect()

  if (!updatedItem) { throw new StatusError(404, 'Not Found') }

  return updatedItem
}

const storage = multer.diskStorage({
  destination: './tmp',
  filename (_req, file, cb) { cb(null, file.originalname) }
})

const imagePath = './public/uploads'
const maxWidth = 500
const maxHeight = 500

const multerUpload = multer({ storage })

const uploadImages = (files: Express.Multer.File[], id: string): void => {
  files.map(async (file, index) => {
    const image = sharp(file.path)
    const info = await image.metadata()
    const fileName = `${id}_${index}`

    if ((info.width as number) > maxWidth || (info.height as number) > maxHeight) {
      await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagePath, `${fileName}.jpg`)
        )

      await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .webp()
        .toFile(
          path.resolve(imagePath, `${fileName}.webp`)
        )
    } else {
      await image
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagePath, `${fileName}.jpg`)
        )

      await image
        .webp()
        .toFile(
          path.resolve(imagePath, `${fileName}.webp`)
        )
    }
    fs.unlinkSync(file.path)
  })
}

export default {
  addItem,
  getItems,
  getItemByID,
  updateItem,
  multerUpload,
  uploadImages
}
