import Router from 'express'
import listProductsService from '../services/listProductService'
import listService from '../services/listService'
import { checkListUpdate, checkNewList } from '../utils/inputValidator'
import { requireCreator, requireAuth } from '../utils/middleware'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const listCreateInput = checkNewList(req)
  const addedList = await listService.addList(listCreateInput, req)
  res.status(201).json(addedList)
})

router.get('/:listID', requireCreator('lists', 'listID', 'params'), async (req, res) => {
  const list = await listService.getListByID(req)
  res.json(list)
})

router.put('/:listID', requireCreator('lists', 'listID', 'params'), async (req, res) => {
  const listUpdateInput = checkListUpdate(req)
  const updatedItem = await listService.updateList(listUpdateInput, req)
  res.json(updatedItem)
})

router.delete('/:listID', requireCreator('lists', 'listID', 'params'), async (req, res) => {
  const deletedList = await listService.deleteList(req)
  res.json(deletedList)
})

router.post('/:listID/products/:productID', requireCreator('lists', 'listID', 'params'), async (req, res) => {
  const addedListProduct = await listProductsService.addListProduct(req)
  res.status(201).json(addedListProduct)
})

router.delete('/:listID/products/:productID', requireCreator('lists', 'listID', 'params'), async (req, res) => {
  const deletedListProduct = await listProductsService.deleteListProduct(req)
  res.json(deletedListProduct)
})

export default router
