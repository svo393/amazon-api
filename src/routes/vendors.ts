import Router from 'express'
import vendorService from '../services/vendorService'
import { checkVendor } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const vendorCreateInput = checkVendor(req)
  const addedVendor = await vendorService.addVendor(vendorCreateInput)
  res.status(201).json(addedVendor)
})

router.get('/', async (_req, res) => {
  const vendors = await vendorService.getVendors()
  res.json(vendors)
})

router.get('/:vendorID', async (req, res) => {
  const vendor = await vendorService.getVendorByID(req)
  res.json(vendor)
})

router.put('/:vendorID', isAdmin, async (req, res) => {
  const vendorUpdateInput = checkVendor(req)
  const updatedItem = await vendorService.updateVendor(vendorUpdateInput, req)
  res.json(updatedItem)
})

export default router
