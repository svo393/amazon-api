import Router from 'express'
import groupService from '../services/groupService'
import { checkGroup, checkGroupProduct } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const groupCreateInput = checkGroup(req)
  const addedGroup = await groupService.addGroup(groupCreateInput)
  res.status(201).json(addedGroup)
})

router.post('/:groupID/product/:productID', isAdmin, async (req, res) => {
  const groupProductCreateInput = checkGroupProduct(req)
  const addedGroupProduct = await groupService.addGroupProduct(groupProductCreateInput, req)
  res.status(201).json(addedGroupProduct)
})

router.put('/:groupID', isAdmin, async (req, res) => {
  const groupUpdateInput = checkGroup(req)
  const updatedItem = await groupService.updateGroup(groupUpdateInput, req)
  res.json(updatedItem)
})

export default router
