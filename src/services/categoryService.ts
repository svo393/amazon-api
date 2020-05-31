import { Request } from 'express'
import { db } from '../utils/db'
import { Category, CategoryCreateInput, CategoryUpdateInput, ProductListData } from '../types'
import { getProductsQuery } from '../utils/queries'
import StatusError from '../utils/StatusError'

const addCategory = async (categoryInput: CategoryCreateInput): Promise<Category> => {
  const { rows: [ addedCategory ] }: { rows: Category[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('categories').insert(categoryInput) ]
  )

  if (!addedCategory) {
    throw new StatusError(409, `Category with name "${categoryInput.name}" already exists`)
  }
  return addedCategory
}

type CategoryBaseData = Category & { children: number[] }

const getCategories = async (): Promise<CategoryBaseData[]> => {
  const categories = await db<Category>('categories')

  return categories.map((c) => ({
    ...c,
    children: categories
      .filter((i) => i.parentCategoryID === c.categoryID)
      .map((i) => i.categoryID)
  }))
}

type Parent = {
  name: string;
  categoryID: number;
};

type SingleCategoryData = Category & {
  children: number[];
  parentChain: Parent[];
  products: ProductListData[];
}

const getCategoryByID = async (req: Request): Promise<SingleCategoryData> => {
  const categoryID = Number(req.params.categoryID)

  const categories = await db<Category>('categories')
  const [ category ] = categories.filter((c) => c.categoryID === categoryID)
  if (!category) throw new StatusError(404, 'Not Found')

  let parentChain: Parent[] = []
  let parentCategoryID = category.parentCategoryID

  while (parentCategoryID) {
    const parent = categories.find((c) => c.categoryID === parentCategoryID)

    if (parent) {
      parentChain.push({ name: parent.name, categoryID: parent.categoryID })
      parentCategoryID = parent.parentCategoryID
    }
  }

  const children = categories
    .filter((c) => c.parentCategoryID === categoryID)
    .map((c) => c.categoryID)

  const products: ProductListData[] = await getProductsQuery.clone()
    .where('categoryID', categoryID)

  return {
    ...category,
    products,
    children,
    parentChain
  }
}

const updateCategory = async (categoryInput: CategoryUpdateInput, req: Request): Promise<SingleCategoryData> => {
  const [ updatedCategory ] = await db<Category>('categories')
    .update(categoryInput, [ 'categoryID' ])
    .where('categoryID', req.params.categoryID)

  if (!updatedCategory) throw new StatusError(404, 'Not Found')
  return getCategoryByID(req)
}

export default {
  addCategory,
  getCategories,
  getCategoryByID,
  updateCategory
}
