import { Item, ItemUpdateInput, PrismaClient, Question, Rating } from '@prisma/client'
import { Response } from 'express'
import { ItemCreateInputRaw } from '../types'
import { makeID } from '../utils'
import { getUserRole } from '../utils/shield'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

type ItemPublicData = Omit<Item, 'createdAt' | 'updatedAt' | 'userID'>

type ItemDataWithQuestionsAndRatings = Item & {
  questions: Question[];
  ratings: Rating[];
}

type ItemPublicDataWithQuestionsAndRatings = Omit<ItemDataWithQuestionsAndRatings, 'createdAt' | 'updatedAt' | 'userID'>

const ItemPublicFields = {
  id: true,
  name: true,
  price: true,
  shortDescription: true,
  longDescription: true,
  stock: true,
  stars: true,
  asin: true,
  media: true,
  primaryMedia: true,
  isAvailable: true,
  categoryName: true,
  vendorName: true
}

const addItem = async (itemInput: ItemCreateInputRaw): Promise<ItemPublicDataWithQuestionsAndRatings> => {
  const items = await prisma.item.findMany({ select: { id: true } })
  const itemIDs = items.map((item) => item.id)
  let id = makeID(7)
  while (itemIDs.includes(id)) { id = makeID(7) }

  const category = await prisma.category.upsert({
    where: { name: itemInput.category },
    update: { name: itemInput.category },
    create: { name: itemInput.category },
    select: { id: true }
  })

  const vendor = await prisma.vendor.upsert({
    where: { name: itemInput.vendor },
    update: { name: itemInput.vendor },
    create: { name: itemInput.vendor },
    select: { id: true }
  })

  const addedItem = await prisma.item.create({
    data: {
      ...itemInput,
      id,
      user: { connect: { id: itemInput.user } },
      category: { connect: { id: category.id } },
      vendor: { connect: { id: vendor.id } }
    },
    include: { questions: true, ratings: true }
  })

  await prisma.disconnect()

  delete addedItem.createdAt
  delete addedItem.updatedAt
  delete addedItem.userID

  return addedItem
}

const getItems = async (): Promise<ItemPublicData[]> => {
  const items = await prisma.item.findMany({
    select: ItemPublicFields
  })
  await prisma.disconnect()
  return items
}

const getItemByID = async (id: string, res: Response): Promise<ItemPublicDataWithQuestionsAndRatings| ItemDataWithQuestionsAndRatings> => {
  const item = await prisma.item.findOne({
    where: { id },
    include: { questions: true, ratings: true }
  })
  await prisma.disconnect()

  if (!item) { throw new StatusError(404, 'Not Found') }

  const role = await getUserRole(res)
  const userIsRoot = role === 'ROOT'

  if (!userIsRoot) {
    delete item.createdAt
    delete item.updatedAt
    delete item.userID
  }

  return item
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

export default {
  addItem,
  getItems,
  getItemByID,
  updateItem
}
