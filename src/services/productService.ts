import { Item, ItemUpdateInput, PrismaClient } from '@prisma/client'
import { Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import R from 'ramda'
import sharp from 'sharp'
import { ItemAllData, ItemCreateInputRaw, ItemPublicData } from '../types'
import { makeID } from '../utils'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

const itemFieldSet = {
  questions: true,
  ratings: true,
  itemParameters: true,
  groupItems: true
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
    select: { name: true }
  })

  const vendor = await prisma.vendor.upsert({
    where: { name: itemInput.vendorName },
    update: { name: itemInput.vendorName },
    create: { name: itemInput.vendorName },
    select: { name: true }
  })

  const brandSection = await prisma.brandSection.create({
    data: { content: itemInput.brandSection },
    select: { id: true }
  })

  const addedItem = await prisma.item.create({
    data: {
      ...R.omit([
        'groups',
        'itemParameters',
        'categoryName',
        'vendorName',
        'userID',
        'brandSection'
      ], itemInput),
      id,
      brandSection: { connect: { id: brandSection.id } },
      user: { connect: { id: itemInput.userID } },
      category: { connect: { name: category.name } },
      vendor: { connect: { name: vendor.name } }
    },
    include: itemFieldSet
  })

  itemInput.itemParameters.map(async (p) => {
    const parameter = await prisma.parameter.upsert({
      where: { name: p.name },
      update: { name: p.name },
      create: { name: p.name },
      select: { name: true }
    })

    await prisma.itemParameter.create({
      data: {
        value: p.value,
        item: { connect: { id } },
        parameter: { connect: { name: parameter.name } }
      }
    })
  })

  itemInput.groups.map(async (i) => {
    let group: { id: string }

    if (i.itemID) {
      const groupItems = await prisma.groupItem.findMany({
        where: { itemID: i.itemID },
        select: { group: true }
      })

      const targetGroup = groupItems.find((gi) => gi.group.name === i.name)
      if (!targetGroup) throw new StatusError(400, 'Invalid Group')

      group = targetGroup.group
    } else {
      group = await prisma.group.create({
        data: { name: i.name },
        select: { id: true }
      })
    }

    await prisma.groupItem.create({
      data: {
        value: i.value,
        item: { connect: { id } },
        group: { connect: { id: group.id } }
      }
    })
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

  if (!item) throw new StatusError(404, 'Not Found')

  const role = res.locals.userRole
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

  if (!updatedItem) throw new StatusError(404, 'Not Found')
  return updatedItem
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
  addItem,
  getItems,
  getItemByID,
  updateItem,
  multerUpload,
  uploadImages
}
