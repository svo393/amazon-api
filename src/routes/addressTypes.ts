import Router from 'express'
import addressService from '../services/addressService'
import addressTypeService from '../services/addressTypeService'
import inputValidator from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const addressTypeCreateInput = inputValidator.checkAddressType(req)
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
  const addressTypeUpdateInput = inputValidator.checkAddressType(req)
  const updatedItem = await addressTypeService.updateAddressType(res, addressTypeUpdateInput, req)
  res.json(updatedItem)
})

router.get('/:addressTypeID/addresses', isAdmin, async (req, res) => {
  const addresses = await addressService.getAddressesByType(req)
  res.json(addresses)
})

export default router
