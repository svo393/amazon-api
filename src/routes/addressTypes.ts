import Router from 'express'
import addressService from '../services/addressService'
import addressTypeService from '../services/addressTypeService'
import { checkAddressType } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const addressTypeCreateInput = checkAddressType(req)
  const addedAddressType = await addressTypeService.addAddressType(addressTypeCreateInput)
  res.status(201).json(addedAddressType)
})

router.get('/', async (_req, res) => {
  const addressTypes = await addressTypeService.getAddressTypes()
  res.json(addressTypes)
})

router.get('/:addressTypeID', async (req, res) => {
  const addressType = await addressTypeService.getAddressTypeByID(res, req)
  res.json(addressType)
})

router.put('/:addressTypeID', isAdmin, async (req, res) => {
  const addressTypeUpdateInput = checkAddressType(req)
  const updatedAddressType = await addressTypeService.updateAddressType(res, addressTypeUpdateInput, req)
  res.json(updatedAddressType)
})

router.get('/:addressTypeID/addresses', isAdmin, async (req, res) => {
  const addresses = await addressService.getAddressesByType(req)
  res.json(addresses)
})

router.delete('/:addressTypeID', isAdmin, async (req, res) => {
  await addressTypeService.deleteAddressType(req)
  res.status(204).end()
})

export default router
