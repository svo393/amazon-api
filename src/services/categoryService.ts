import { Request } from 'express'
import { CategoriesFiltersInput, Category, CategoryCreateInput, CategoryUpdateInput } from '../types'
import { defaultLimit } from '../utils/constants'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import sortItems from '../utils/sortItems'
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

  if (addedCategory === undefined) {
    throw new StatusError(409, `Category with name "${categoryInput.name}" already exists`)
  }
  return addedCategory
}

type CategoryListRawData = Category & { productCount: string }
type CategoryListData = Omit<CategoryListRawData, 'productCount'> & {
  children: { categoryID: number; name: string }[];
  productCount: number;
}

const getCategories = async (categoriesFiltersinput: CategoriesFiltersInput): Promise<{ batch: CategoryListData[]; totalCount: number }> => {
  const {
    page = 1,
    sortBy = 'groupID',
    q
  } = categoriesFiltersinput

  let rawCategories: CategoryListRawData[] = await db('categories as c')
    .select('c.categoryID', 'c.name', 'c.parentCategoryID')
    .count('p.productID as productCount')
    .joinRaw('LEFT JOIN products as p USING ("categoryID")')
    .groupBy('c.categoryID')

  let categories: CategoryListData[]

  categories = rawCategories.map((c) => ({
    ...c,
    productCount: parseInt(c.productCount),
    children: []
  }))

  if (q !== undefined) {
    categories = categories
      .filter((_, i) =>
        fuseIndexes(categories, [ 'name' ], q).includes(i))
  }

  const categoriesSorted = sortItems(categories, sortBy)

  const _categoriesSorted = categoriesSorted.map((c) => ({
    ...c,
    children: rawCategories
      .filter((rc) => rc.parentCategoryID === c.categoryID)
      .map((rc) => ({ categoryID: rc.categoryID, name: rc.name }))
  }))

  return {
    batch: _categoriesSorted.slice((page - 1) * defaultLimit, (page - 1) * defaultLimit + defaultLimit),
    totalCount: categories.length
  }
}

type Parent = { name: string; categoryID: number };

type SingleCategoryData = Omit<CategoryListData, 'parentCategoryID'> & { parentChain: Parent[] }

const getCategoryByID = async (req: Request): Promise<SingleCategoryData> => {
  const categoryID = req.params.categoryID

  const categories: (Category & { productCount: string })[] = await db('categories as c')
    .select('c.categoryID', 'c.name', 'c.parentCategoryID')
    .count('p.productID as productCount')
    .joinRaw('LEFT JOIN products as p USING ("categoryID")')
    .groupBy('c.categoryID')

  const category = categories.find((c) => c.categoryID === categoryID)
  if (category === undefined) throw new StatusError(404, 'Not Found')

  let parentChain: Parent[] = []
  let parentCategoryID = category.parentCategoryID

  while (parentCategoryID) {
    const parent = categories.find((c) => c.categoryID === parentCategoryID)

    if (parent !== undefined) {
      parentChain.push({ name: parent.name, categoryID: parent.categoryID })
      parentCategoryID = parent.parentCategoryID
    }
  }

  const children = categories
    .filter((c) => c.parentCategoryID === categoryID)
    .map((c) => ({ categoryID: c.categoryID, name: c.name }))

  delete category.parentCategoryID

  return {
    ...category,
    productCount: parseInt(category.productCount),
    children,
    parentChain: parentChain.reverse()
  }
}

const updateCategory = async (categoryInput: CategoryUpdateInput, req: Request): Promise<SingleCategoryData> => {
  const [ updatedCategory ] = await db<Category>('categories')
    .update(categoryInput, [ 'categoryID' ])
    .where('categoryID', req.params.categoryID)

  if (updatedCategory === undefined) throw new StatusError(404, 'Not Found')
  return getCategoryByID(req)
}

export default {
  addCategory,
  getCategories,
  getCategoryByID,
  updateCategory
}
