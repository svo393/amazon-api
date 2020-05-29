import Router from 'express'
import listProductsService from '../services/listProductService'
import listService from '../services/listService'
import { checkListUpdate, checkNewList } from '../utils/inputValidator'
import { isCreator, isLoggedIn } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const listCreateInput = checkNewList(req)
  const addedList = await listService.addList(listCreateInput, res)
  res.status(201).json(addedList)
})

router.get('/:listID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  const list = await listService.getListByID(req)
  res.json(list)
})

router.put('/:listID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  const listUpdateInput = checkListUpdate(req)
  const updatedItem = await listService.updateList(listUpdateInput, req)
  res.json(updatedItem)
})

router.delete('/:listID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  await listService.deleteList(req)
  res.status(204).end()
})

router.post('/:listID/products/:productID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  const addedListProduct = await listProductsService.addListProduct(req)
  res.status(201).json(addedListProduct)
})

router.delete('/:listID/products/:productID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  await listProductsService.deleteListProduct(req)
  res.status(204).end()
})

export default router
