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

router.get('/:id', async (req, res) => {
  const category = await categoryService.getCategoryByID(req.params.id)
  res.json(category)
})

router.put('/:id', async (req, res) => {
  await shield.isAdmin(res)
  const categoryInput = inputValidator.checkCategoryUpdate(req.body)
  const updatedItem = await categoryService.updateCategory(categoryInput, req.params.id)
  res.json(updatedItem)
})

export default router
