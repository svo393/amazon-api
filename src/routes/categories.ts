import Router from 'express'
import categoryService from '../services/categoryService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  await shield.isAdmin(res)
  const categoryInput = inputValidator.checkNewCategory(req.body)
  const addedCategory = await categoryService.addCategory(categoryInput)
  res.status(201).json(addedCategory)
})

router.get('/', async (_req, res) => {
  const categories = await categoryService.getCategories()
  res.json(categories)
})

router.get('/:name', async (req, res) => {
  const category = await categoryService.getCategoryByName(req.params.name)
  res.json(category)
})

router.put('/:name', async (req, res) => {
  await shield.isAdmin(res)
  const categoryInput = inputValidator.checkCategoryUpdate(req.body)
  const updatedItem = await categoryService.updateCategory(categoryInput, req.params.name)
  res.json(updatedItem)
})

export default router
