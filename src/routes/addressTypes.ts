import Router from 'express'
import addressTypeService from '../services/addressTypeService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isAdmin(res)
  const addressTypeCreateInput = inputValidator.checkAddressType(req.body)
  const addedAddressType = await addressTypeService.addAddressType(addressTypeCreateInput)
  res.status(201).json(addedAddressType)
})

router.get('/', async (_req, res) => {
  const addressTypes = await addressTypeService.getAddressTypes()
  res.json(addressTypes)
})

router.get('/:addressTypeID', async (req, res) => {
  const addressType = await addressTypeService.getAddressTypeByID(res, Number(req.params.addressTypeID))
  res.json(addressType)
})

router.put('/:addressTypeID', async (req, res) => {
  shield.isAdmin(res)
  const addressTypeUpdateInput = inputValidator.checkAddressType(req.body)
  const updatedItem = await addressTypeService.updateAddressType(res, addressTypeUpdateInput, Number(req.params.addressTypeID))
  res.json(updatedItem)
})

export default router
