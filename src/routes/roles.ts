import Router from 'express'
import roleService from '../services/roleService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isRoot(res)
  const roleCreateInput = inputValidator.checkRole(req.body)
  const addedRole = await roleService.addRole(roleCreateInput)
  res.status(201).json(addedRole)
})

router.get('/', async (_req, res) => {
  shield.isRoot(res)
  const roles = await roleService.getRoles()
  res.json(roles)
})

router.get('/:roleID', async (req, res) => {
  shield.isRoot(res)
  const role = await roleService.getRoleByID(Number(req.params.roleID))
  res.json(role)
})

router.put('/:roleID', async (req, res) => {
  shield.isRoot(res)
  const roleUpdateInput = inputValidator.checkRole(req.body)
  const updatedItem = await roleService.updateRole(roleUpdateInput, Number(req.params.roleID))
  res.json(updatedItem)
})

export default router
