import { Request } from 'express'
import R from 'ramda'
import { Category, CategoryCreateInput, CategoryUpdateInput, CategoryFiltersInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addCategory = async (categoryInput: CategoryCreateInput): Promise<Category> => {
  const { rows: [ addedCategory ] }: { rows: Category[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
      `,
    [ db('categories').insert(categoryInput) ]
  )

  if (typeof (addedCategory) === 'undefined') {
    throw new StatusError(409, `Category with name "${categoryInput.name}" already exists`)
  }
  return addedCategory
}

type CategoryWithProductCount = Category & { productCount: number }
type CategoryListData = CategoryWithProductCount & { children: number[] }

const getCategories = async (categoryFilterInput: CategoryFiltersInput): Promise<CategoryListData[]> => {
  const { name } = categoryFilterInput

  let categories: CategoryWithProductCount[] = await db('categories as c')
    .select('c.categoryID', 'c.name')
    .count('p.productID as productCount')
    .joinRaw('JOIN products as p USING ("categoryID")')
    .groupBy('c.categoryID')

  if (typeof (name) !== 'undefined') {
    categories = categories
      .filter((v) => v.name.toLowerCase().includes(name.toLowerCase()))
  }

  return categories.map((c) => ({
    ...c,
    children: categories
      .filter((c) => c.parentCategoryID === c.categoryID)
      .map((c) => c.categoryID)
  }))
}

type Parent = { name: string; categoryID: number };

type SingleCategoryData = Omit<CategoryListData, 'parentCategoryID'> & { parentChain: Parent[] }

const getCategoryByID = async (req: Request): Promise<SingleCategoryData> => {
  const categoryID = Number(req.params.categoryID)

  const categories: (Category & { productCount: number })[] = await db('categories as c')
    .select('c.categoryID', 'c.name')
    .count('p.productID as productCount')
    .joinRaw('LEFT JOIN products as p USING ("categoryID")')
    .groupBy('c.categoryID')

  const [ category ] = categories.filter((c) => c.categoryID === categoryID)
  if (typeof (category) === 'undefined') throw new StatusError(404, 'Not Found')

  let parentChain: Parent[] = []
  let parentCategoryID = category.parentCategoryID

  while (parentCategoryID) {
    const parent = categories.find((c) => c.categoryID === parentCategoryID)

    if (typeof (parent) !== 'undefined') {
      parentChain.push({ name: parent.name, categoryID: parent.categoryID })
      parentCategoryID = parent.parentCategoryID
    }
  }

  const children = categories
    .filter((c) => c.parentCategoryID === categoryID)
    .map((c) => c.categoryID)

  delete category.parentCategoryID

  return {
    ...category,
    children,
    parentChain
  }
}

const updateCategory = async (categoryInput: CategoryUpdateInput, req: Request): Promise<SingleCategoryData> => {
  const [ updatedCategory ] = await db<Category>('categories')
    .update(categoryInput, [ 'categoryID' ])
    .where('categoryID', req.params.categoryID)

  if (typeof (updatedCategory) === 'undefined') throw new StatusError(404, 'Not Found')
  return getCategoryByID(req)
}

export default {
  addCategory,
  getCategories,
  getCategoryByID,
  updateCategory
}
