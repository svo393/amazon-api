import Router from 'express'
import addressService from '../services/addressService'
import addressTypeService from '../services/addressTypeService'
import { checkAddressType } from '../utils/typeGuard'
import { requireAdmin } from '../utils/middleware'

const router = Router()

router.post('/', requireAdmin, async (req, res) => {
  const addressTypeCreateInput = checkAddressType(req)
  const addedAddressType = await addressTypeService.addAddressType(
    addressTypeCreateInput
  )
  res.status(201).json(addedAddressType)
})

router.get('/', async (_, res) => {
  const addressTypes = await addressTypeService.getAddressTypes()
  res.json(addressTypes)
})

router.get('/:addressTypeName', async (req, res) => {
  const addressType = await addressTypeService.getAddressTypeByName(
    req
  )
  res.json(addressType)
})

router.put('/:addressTypeName', requireAdmin, async (req, res) => {
  const addressTypeUpdateInput = checkAddressType(req)
  const updatedAddressType = await addressTypeService.updateAddressType(
    addressTypeUpdateInput,
    req
  )
  res.json(updatedAddressType)
})

router.get(
  '/:addressTypeName/addresses',
  requireAdmin,
  async (req, res) => {
    const addresses = await addressService.getAddressesByType(req)
    res.json(addresses)
  }
)

router.delete('/:addressTypeName', requireAdmin, async (req, res) => {
  await addressTypeService.deleteAddressType(req)
  res.status(204).end()
})

export default router
