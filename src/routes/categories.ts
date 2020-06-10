import Router from 'express'
import categoryService from '../services/categoryService'
import productService from '../services/productService'
import { checkCategoryUpdate, checkNewCategory } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const categoryCreateInput = checkNewCategory(req)
  const addedCategory = await categoryService.addCategory(categoryCreateInput)
  res.status(201).json(addedCategory)
})

router.get('/', async (_req, res) => {
  const categories = await categoryService.getCategories()
  res.json(categories)
})

router.get('/:categoryID', async (req, res) => {
  const category = await categoryService.getCategoryByID(req)
  res.json(category)
})

router.put('/:categoryID', isAdmin, async (req, res) => {
  const categoryUpdateInput = checkCategoryUpdate(req)
  const updatedItem = await categoryService.updateCategory(categoryUpdateInput, req)
  res.json(updatedItem)
})

router.get('/:categoryID/products', async (req, res) => {
  const products = await productService.getProductsByCategory(req)
  res.json(products)
})

export default router
