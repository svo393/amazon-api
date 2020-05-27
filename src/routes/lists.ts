import Router from 'express'
import listService from '../services/listService'
import inputValidator from '../utils/inputValidator'
import { isCreator, isLoggedIn, isSameUserOrAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const listCreateInput = inputValidator.checkNewList(req.body)
  const addedList = await listService.addList(listCreateInput, res)
  res.status(201).json(addedList)
})

router.get('/', isSameUserOrAdmin('query'), async (req, res) => {
  const listFetchInput = inputValidator.checkListsFetch(req.query)
  const lists = await listService.getLists(listFetchInput)
  res.json(lists)
})

router.get('/:listID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  const list = await listService.getListByID(Number(req.params.listID))
  res.json(list)
})

router.put('/:listID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  const listUpdateInput = inputValidator.checkListUpdate(req.body)
  const updatedItem = await listService.updateList(listUpdateInput, Number(req.params.listID))
  res.json(updatedItem)
})

router.delete('/:listID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  await listService.deleteList(Number(req.params.listID))
  res.status(204).end()
})

export default router
