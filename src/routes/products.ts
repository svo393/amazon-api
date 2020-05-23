import Router from 'express'
import productService from '../services/productService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  const itemInput = inputValidator.checkNewItem(req.body)
  const addedItem = await productService.addItem(itemInput)
  res.status(201).json(addedItem)
})

router.get('/', async (_req, res) => {
  const items = await productService.getItems()
  res.json(items)
})

router.get('/:id', async (req, res) => {
  const item = await productService.getItemByID(req.params.id, res)
  res.json(item)
})

router.put('/:id', async (req, res) => {
  await shield.isCreator(res, 'item', req.params.id)
  const itemInput = inputValidator.checkItemUpdate(req.body)
  const updatedItem = await productService.updateItem(itemInput, req.params.id)
  res.json(updatedItem)
})

router.post('/:id/upload', productService.multerUpload.array('itemMedia', 10), async (req, res) => {
  shield.isAdmin(res)
  const itemMedia = inputValidator.checkItemMediaUpload(req.files)
  productService.uploadImages(itemMedia, req.params.id)
  res.sendStatus(204)
})

export default router
