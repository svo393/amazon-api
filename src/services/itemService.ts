import { Item, PrismaClient } from '@prisma/client'
import { Response } from 'express'
import { ItemCreateInputRaw, ItemPublicData } from '../types'
import { makeID } from '../utils'
import { getUserRole } from '../utils/shield'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

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

const addItem = async (itemInput: ItemCreateInputRaw): Promise<ItemPublicData> => {
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
    }
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

const getItemByID = async (id: string, res: Response): Promise<Item | ItemPublicData> => {
  const role = await getUserRole(res)
  const userIsRoot = role === 'ROOT'

  const item = userIsRoot
    ? await prisma.item.findOne({
      where: { id }
    })
    : await prisma.item.findOne({
      where: { id },
      select: ItemPublicFields
    })

  await prisma.disconnect()

  if (!item) { throw new StatusError(404, 'Not Found') }

  return item
}

// const updateItem = async (itemInput: ItemUpdateInput, id: string): Promise<ItemPersonalData> => {
//   const updatedItem = await prisma.item.update({
//     where: { id },
//     data: { ...itemInput },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       avatar: true,
//       createdAt: true,
//       role: true
//     }
//   })

//   if (!updatedItem) {
//     await prisma.disconnect()
//     throw new StatusError(404, 'Not Found')
//   }

//   const cartItems = await prisma.cartItem.findMany({
//     where: { item: { id: updatedItem.id } },
//     include: { item: true }
//   })
//   await prisma.disconnect()

//   return {
//     ...updatedItem,
//     cart: cartItems
//   }
// }

export default {
  addItem,
  getItems,
  getItemByID
  // loginItem,
  // updateItem
}
