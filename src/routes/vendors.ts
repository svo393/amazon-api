import Router from 'express'
import vendorService from '../services/vendorService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  await shield.isAdmin(res)
  const vendorInput = inputValidator.checkNewVendor(req.body)
  const addedVendor = await vendorService.addVendor(vendorInput)
  res.status(201).json(addedVendor)
})

router.get('/', async (_req, res) => {
  const vendors = await vendorService.getVendors()
  res.json(vendors)
})

router.get('/:id', async (req, res) => {
  const vendor = await vendorService.getVendorByID(req.params.id)
  res.json(vendor)
})

router.put('/:id', async (req, res) => {
  await shield.isAdmin(res)
  const vendorInput = inputValidator.checkVendorUpdate(req.body)
  const updatedItem = await vendorService.updateVendor(vendorInput, req.params.id)
  res.json(updatedItem)
})

export default router
