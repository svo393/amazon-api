import { Category, CategoryCreateInput, CategoryUpdateInput, PrismaClient } from '@prisma/client'
import { ItemListData } from '../types'
import StatusError from '../utils/StatusError'
import R from 'ramda'

const prisma = new PrismaClient()

type CategoryData = {
  items?: ItemListData[];
  children: Category[];
  parentID: string | null;
  name: string;
}

const addCategory = async (categoryInput: CategoryCreateInput): Promise<Category> => {
  const existingCategory = await prisma.category.findOne({
    where: { name: categoryInput.name }
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

const getCategories = async (): Promise<CategoryData[]> => {
  const categories = await prisma.category.findMany({
    include: { children: true }
  })
  await prisma.disconnect()

  return categories
}

const getCategoryByName = async (name: string): Promise<CategoryData> => {
  const category = await prisma.category.findOne({
    where: { name },
    include: { items: true, children: true }
  })
  await prisma.disconnect()

  if (!category) { throw new StatusError(404, 'Not Found') }

  const filteredCategory = {
    ...category,
    items: category.items.map((i) => (
      R.pick([
        'id',
        'name',
        'listPrice',
        'price',
        'stars',
        'primaryMedia',
        'ratingCount'
      ])(i)
    ))
  }

  return filteredCategory
}

const updateCategory = async (categoryInput: CategoryUpdateInput, name: string): Promise<CategoryData> => {
  const updatedCategory = await prisma.category.update({
    where: { name },
    data: categoryInput,
    include: { items: true, children: true }
  })
  await prisma.disconnect()

  if (!updatedCategory) { throw new StatusError(404, 'Not Found') }

  return updatedCategory
}

export default {
  addCategory,
  getCategories,
  getCategoryByName,
  updateCategory
}
