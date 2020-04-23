import Router from 'express'
import itemService from '../services/itemService'
import logger from '../utils/logger'
import validator from '../utils/inputValidator'

const router = Router()

router.post('/', (req, res) => {
  try {
    const newItem = validator.toNewItem(req.body)
    const addedItem = itemService.addItem(newItem)
    res.status(201).json(addedItem)
  } catch (e) {
    logger.error(e)
    res.status(500).send('Server error in creating item. Please try again later.')
  }
})

router.get('/', (_req, res) => {
  res.send(itemService.getPublicItems())
})

router.get('/:id', (req, res) => {
  const item = itemService.getPublicItemByID(req.params.id)

  item
    ? res.send(item)
    : res.sendStatus(404)
})

router.put('/:id', (req, res) => {
  try {
    const itemToUpdate = validator.toUpdatedItem(req.body, req.cookies)
    const updatedItem = itemService.updateItem(itemToUpdate)

    updatedItem
      ? res.status(200).json(updatedItem)
      : res.sendStatus(404)
  } catch (e) {
    logger.error(e)
    res.status(500).send('Server error in updating item. Please try again later.')
  }
})

router.delete('/:id', (req, res) => {
  try {
    const itemToDelete = validator.toDeletedItem(req.params.id, req.cookies)
    const deletedItem = itemService.deleteItem(itemToDelete)

    deletedItem
      ? res.status(204)
      : res.sendStatus(404)
  } catch (e) {
    logger.error(e)
    res.status(500).send('Server error in deleting item. Please try again later.')
  }
})

router.all('*', (req, res) => {
  res.status(405).send(`Method ${req.method} is not allowed`)
})

export default router
