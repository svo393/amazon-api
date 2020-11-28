import Router from 'express'
import roleService from '../services/roleService'
import { checkRole } from '../utils/inputValidator'
import { requireRoot } from '../utils/middleware'

const router = Router()

router.post('/', requireRoot, async (req, res) => {
  const roleCreateInput = checkRole(req)
  const addedRole = await roleService.addRole(roleCreateInput)
  res.status(201).json(addedRole)
})

router.get('/', requireRoot, async (_, res) => {
  const roles = await roleService.getRoles()
  res.json(roles)
})

router.put('/:roleName', requireRoot, async (req, res) => {
  const roleUpdateInput = checkRole(req)
  const updatedRole = await roleService.updateRole(
    roleUpdateInput,
    req
  )
  res.json(updatedRole)
})

router.delete('/:roleName', requireRoot, async (req, res) => {
  await roleService.deleteRole(req)
  res.status(204).end()
})

export default router
