import Router from 'express'
import categoryService from '../services/categoryService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isAdmin(res)
  const categoryCreateInput = inputValidator.checkNewCategory(req.body)
  const addedCategory = await categoryService.addCategory(categoryCreateInput)
  res.status(201).json(addedCategory)
})

router.get('/', async (_req, res) => {
  const categories = await categoryService.getCategories()
  res.json(categories)
})

router.get('/:categoryID', async (req, res) => {
  const category = await categoryService.getCategoryByID(Number(req.params.categoryID))
  res.json(category)
})

router.put('/:categoryID', async (req, res) => {
  shield.isAdmin(res)
  const categoryUpdateInput = inputValidator.checkCategoryUpdate(req.body)
  const updatedItem = await categoryService.updateCategory(categoryUpdateInput, Number(req.params.categoryID))
  res.json(updatedItem)
})

export default router
