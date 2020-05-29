import Router from 'express'
import roleService from '../services/roleService'
import { checkRole } from '../utils/inputValidator'
import { isRoot } from '../utils/middleware'

const router = Router()

router.post('/', isRoot, async (req, res) => {
  const roleCreateInput = checkRole(req)
  const addedRole = await roleService.addRole(roleCreateInput)
  res.status(201).json(addedRole)
})

router.get('/', isRoot, async (_req, res) => {
  const roles = await roleService.getRoles()
  res.json(roles)
})

router.get('/:roleID', isRoot, async (req, res) => {
  const role = await roleService.getRoleByID(req)
  res.json(role)
})

router.put('/:roleID', isRoot, async (req, res) => {
  const roleUpdateInput = checkRole(req)
  const updatedItem = await roleService.updateRole(roleUpdateInput, req)
  res.json(updatedItem)
})

export default router
