import Router from 'express'
import categoryService from '../services/categoryService'
import { checkCategoryFilters, checkCategoryUpdate, checkNewCategory } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const categoryCreateInput = checkNewCategory(req)
  const addedCategory = await categoryService.addCategory(categoryCreateInput)
  res.status(201).json(addedCategory)
})

router.get('/', async (req, res) => {
  const categoryFilterInput = checkCategoryFilters(req)
  const categories = await categoryService.getCategories(categoryFilterInput)
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

export default router
