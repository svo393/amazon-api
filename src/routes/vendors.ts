import Router from 'express'
import vendorService from '../services/vendorService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isAdmin(res)
  const vendorCreateInput = inputValidator.checkNewVendor(req.body)
  const addedVendor = await vendorService.addVendor(vendorCreateInput)
  res.status(201).json(addedVendor)
})

router.get('/', async (_req, res) => {
  const vendors = await vendorService.getVendors()
  res.json(vendors)
})

router.get('/:vendorID', async (req, res) => {
  const vendor = await vendorService.getVendorByID(Number(req.params.vendorID))
  res.json(vendor)
})

router.put('/:vendorID', async (req, res) => {
  shield.isAdmin(res)
  const vendorUpdateInput = inputValidator.checkVendorUpdate(req.body)
  const updatedItem = await vendorService.updateVendor(vendorUpdateInput, Number(req.params.vendorID))
  res.json(updatedItem)
})

export default router
