import Router from 'express'
import vendorService from '../services/vendorService'
import { checkVendor, checkVendorFilters } from '../utils/typeGuard'
import { requireAdmin } from '../utils/middleware'

const router = Router()

router.post('/', requireAdmin, async (req, res) => {
  const vendorCreateInput = checkVendor(req)
  const addedVendor = await vendorService.addVendor(vendorCreateInput)
  res.status(201).json(addedVendor)
})

router.get('/', async (req, res) => {
  const vendorsFiltersInput = checkVendorFilters(req)
  const vendors = await vendorService.getVendors(vendorsFiltersInput)
  res.json(vendors)
})

router.get('/:vendorID', async (req, res) => {
  const vendor = await vendorService.getVendorByID(req)
  res.json(vendor)
})

router.put('/:vendorID', requireAdmin, async (req, res) => {
  const vendorUpdateInput = checkVendor(req)
  const updatedItem = await vendorService.updateVendor(
    vendorUpdateInput,
    req
  )
  res.json(updatedItem)
})

export default router
