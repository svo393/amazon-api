import { CategoryUpdateInput, PrismaClient } from '@prisma/client'
import { ItemListData, Category, CategoryCreateInput, Product, Rating } from '../types'
import StatusError from '../utils/StatusError'
import db from '../../src/utils/db'
import R from 'ramda'

const prisma = new PrismaClient()

const addCategory = async (categoryInput: CategoryCreateInput): Promise<Category> => {
  const { name } = categoryInput

  const existingCategory = await db<Category>('categories')
    .first('categoryID')
    .where('name', name)

  if (existingCategory) {
    throw new StatusError(409, `Category with name "${name}" already exists`)
  }

  return await db<Category>('categories')
    .insert(categoryInput, [ '*' ])
}

type CategoryBaseData = Category & { children: number[] }

const getCategories = async (): Promise<CategoryBaseData[]> => {
  const categories = await db<Category>('categories')

  return categories.map((c) => {
    const filteredCategories = categories
      .filter((i) => i.parentCategoryID === c.categoryID)
    return { ...c, children: filteredCategories.map((i) => i.categoryID) }
  })
}

type ProductListData = Pick<Product,
  | 'productID'
  | 'title'
  | 'listPrice'
  | 'price'
  | 'primaryMedia'
  > & {
    stars: number;
    ratingCount: number;
}

type SingleCategoryData = Category & {
  children: number[];
  parentChain: {
    name: string;
    categoryID: number;
  }[];
  products: ProductListData[];
}

const getCategoryByID = async (categoryID: string): Promise<SingleCategoryData | null> => {
  const categories = await db<Category>('categories')
  const category = categories.filter((c) => c.categoryID === Number(categoryID))
  if (!category) throw new StatusError(404, 'Not Found')

  const { rows: products }: { rows: ProductListData[] } = await db.raw(
    `SELECT
      "p"."title", "listPrice", "price", "primaryMedia", "p"."productID",
      AVG("r"."stars") as stars,
      COUNT("r"."ratingID") as ratingCount
    FROM products as p
    LEFT JOIN ratings as r USING ("productID")
    WHERE "categoryID" = ${categoryID}
    GROUP BY "p"."productID"`
  )

  // const products = await db<Product>('products')
  //   .where('categoryID', categoryID)

  // const productIDs = products.map((p) => p.productID)

  // const ratings = await db<Rating>('ratings')
  //   .whereIn('productID', productIDs)

  // const filteredCategory = {
  //   ...category,
  //   items: category.items.map((i) => (
  //     R.pick([
  //       'id',
  //       'name',
  //       'listPrice',
  //       'price',
  //       'stars',
  //       'primaryMedia',
  //       'ratingCount'
  //     ])(i)
  //   ))
  // }

  // return filteredCategory
  return null
}

// const updateCategory = async (categoryInput: CategoryUpdateInput, name: string): Promise<CategoryData> => {
//   const updatedCategory = await prisma.category.update({
//     where: { name },
//     data: categoryInput,
//     include: { items: true, children: true }
//   })
//   await prisma.disconnect()

//   if (!updatedCategory) throw new StatusError(404, 'Not Found')

//   return updatedCategory
// }

export default {
  addCategory,
  getCategories,
  getCategoryByID
  // updateCategory
}
