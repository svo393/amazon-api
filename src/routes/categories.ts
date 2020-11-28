import Router from 'express'
import categoryService from '../services/categoryService'
import {
  checkCategoryFilters,
  checkCategoryUpdate,
  checkNewCategory
} from '../utils/inputValidator'
import { requireAdmin } from '../utils/middleware'

const router = Router()

router.post('/', requireAdmin, async (req, res) => {
  const categoryCreateInput = checkNewCategory(req)
  const addedCategory = await categoryService.addCategory(
    categoryCreateInput
  )
  res.status(201).json(addedCategory)
})

router.get('/', async (req, res) => {
  const categoriesFiltersinput = checkCategoryFilters(req)
  const categories = await categoryService.getCategories(
    categoriesFiltersinput
  )
  res.json(categories)
})

router.get('/departments', async (_, res) => {
  const categories = await categoryService.getDepartments()
  res.json(categories)
})

router.get('/:categoryID', async (req, res) => {
  const category = await categoryService.getCategoryByID(req)
  res.json(category)
})

router.put('/:categoryID', requireAdmin, async (req, res) => {
  const categoryUpdateInput = checkCategoryUpdate(req)
  const updatedItem = await categoryService.updateCategory(
    categoryUpdateInput,
    req
  )
  res.json(updatedItem)
})

export default router
