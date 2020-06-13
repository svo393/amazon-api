import Router from 'express'
import productService from '../services/productService'
import vendorService from '../services/vendorService'
import { checkVendor } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const vendorCreateInput = checkVendor(req)
  const addedVendor = await vendorService.addVendor(vendorCreateInput)
  res.status(201).json(addedVendor)
})

router.get('/', async (req, res) => {
  const vendors = await vendorService.getVendors(req)
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

router.get('/:vendorID/products', async (req, res) => {
  const products = await productService.getProductsByVendor(req)
  res.json(products)
})

export default router
