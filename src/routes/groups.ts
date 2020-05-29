import Router from 'express'
import groupService from '../services/groupService'
import inputValidator from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const groupCreateInput = inputValidator.checkGroup(req)
  const addedGroup = await groupService.addGroup(groupCreateInput)
  res.status(201).json(addedGroup)
})

router.get('/', async (_req, res) => {
  const groups = await groupService.getGroups()
  res.json(groups)
})

router.get('/:groupID', async (req, res) => {
  const group = await groupService.getGroupByID(req)
  res.json(group)
})

router.put('/:groupID', isAdmin, async (req, res) => {
  const groupUpdateInput = inputValidator.checkGroup(req)
  const updatedItem = await groupService.updateGroup(groupUpdateInput, req)
  res.json(updatedItem)
})

export default router
