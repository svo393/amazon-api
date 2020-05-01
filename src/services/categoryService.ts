import { Category, CategoryCreateInput, PrismaClient, CategoryGetPayload, CategoryUpdateInput } from '@prisma/client'
import { Response } from 'express'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

type CategoryAllData = CategoryGetPayload<{
  include: { items: true };
}>

const addCategory = async (categoryInput: CategoryCreateInput): Promise<Category> => {
  const existingCategory = await prisma.category.findOne({
    where: { name: categoryInput.name },
    select: { id: true }
  })

  if (existingCategory) {
    await prisma.disconnect()
    throw new StatusError(409, `Category with name "${categoryInput.name}" already exists`)
  }

  const addedCategory = await prisma.category.create({
    data: categoryInput
  })
  await prisma.disconnect()

  return addedCategory
}

const getCategories = async (): Promise<CategoryAllData[]> => {
  const categories = await prisma.category.findMany({
    include: { items: true }
  })
  await prisma.disconnect()
  return categories
}

const getCategoryByID = async (id: string): Promise<CategoryAllData> => {
  const category = await prisma.category.findOne({
    where: { id },
    include: { items: true }
  })
  await prisma.disconnect()

  if (!category) { throw new StatusError(404, 'Not Found') }

  return category
}

const updateCategory = async (categoryInput: CategoryUpdateInput, id: string): Promise<CategoryAllData> => {
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: categoryInput,
    include: { items: true }
  })
  await prisma.disconnect()

  if (!updatedCategory) { throw new StatusError(404, 'Not Found') }

  return updatedCategory
}

export default {
  addCategory,
  getCategories,
  getCategoryByID,
  updateCategory
}
