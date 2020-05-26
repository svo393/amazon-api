import Router from 'express'
import listService from '../services/listService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isLoggedIn(res)
  const listCreateInput = inputValidator.checkNewList(req.body)
  const addedList = await listService.addList(listCreateInput, res)
  res.status(201).json(addedList)
})

router.get('/', async (req, res) => {
  shield.isSameUserOrAdmin(req, res, 'query')
  const listFetchInput = inputValidator.checkListsFetch(req.query)
  const lists = await listService.getLists(listFetchInput)
  res.json(lists)
})

router.get('/:listID', async (req, res) => {
  shield.isCreator(res, 'lists', 'listID', Number(req.params.listID))
  const list = await listService.getListByID(Number(req.params.listID))
  res.json(list)
})

router.put('/:listID', async (req, res) => {
  shield.isCreator(res, 'lists', 'listID', Number(req.params.listID))
  const listUpdateInput = inputValidator.checkListUpdate(req.body)
  const updatedItem = await listService.updateList(listUpdateInput, Number(req.params.listID))
  res.json(updatedItem)
})

router.delete('/:listID', async (req, res) => {
  shield.isCreator(res, 'lists', 'listID', Number(req.params.listID))
  await listService.deleteList(Number(req.params.listID))
  res.status(204).end()
})

export default router
