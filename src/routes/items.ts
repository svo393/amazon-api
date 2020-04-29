import Router from 'express'
import itemService from '../services/itemService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  const itemInput = inputValidator.checkNewItem(req.body)
  const addedItem = await itemService.addItem(itemInput)
  res.status(201).json(addedItem)
})

router.get('/', async (_req, res) => {
  const items = await itemService.getItems()
  res.json(items)
})

router.get('/:id', async (req, res) => {
  const item = await itemService.getItemByID(req.params.id, res)
  res.json(item)
})

router.put('/:id', async (req, res) => {
  await shield.isCreator(res, 'item', req.params.id)
  const itemInput = inputValidator.checkItemUpdate(req.body)
  const updatedItem = await itemService.updateItem(itemInput, req.params.id)
  res.json(updatedItem)
})

export default router
