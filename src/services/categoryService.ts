import { db } from '../../src/utils/db'
import { Category, CategoryCreateInput, CategoryUpdateInput, Product, ProductListData } from '../types'
import StatusError from '../utils/StatusError'
import { getProductsQuery } from '../utils/queries'

const addCategory = async (categoryInput: CategoryCreateInput): Promise<Category> => {
  const { name } = categoryInput

  const existingCategory = await db<Category>('categories')
    .first('categoryID')
    .where('name', name)

  if (existingCategory) {
    throw new StatusError(409, `Category with name "${name}" already exists`)
  }

  const [ addedCategory ]: Category[] = await db<Category>('categories')
    .insert(categoryInput, [ '*' ])

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

const getCategoryByID = async (categoryID: number): Promise<SingleCategoryData> => {
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

  const products: ProductListData[] = await getProductsQuery
    .where('categoryID', categoryID)

  return {
    ...category,
    products,
    children,
    parentChain
  }
}

const updateCategory = async (categoryInput: CategoryUpdateInput, categoryID: number): Promise<SingleCategoryData> => {
  const [ updatedCategory ] = await db<Category>('categories')
    .update({ ...categoryInput }, [ 'categoryID' ])
    .where('categoryID', categoryID)

  if (!updatedCategory) throw new StatusError(404, 'Not Found')
  return getCategoryByID(updatedCategory.categoryID)
}

export default {
  addCategory,
  getCategories,
  getCategoryByID,
  updateCategory
}
