import Router from 'express'
import parameterService from '../services/parameterService'
import productService from '../services/productService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import { checkMediaUpload, checkNewProduct, checkProductUpdate } from '../utils/inputValidator'
import { isAdmin, isCreator, multerUpload } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const productInput = checkNewProduct(req)
  const addedProduct = await productService.addProduct(productInput, res)
  res.status(201).json(addedProduct)
})

router.get('/:productID', async (req, res) => {
  const product = await productService.getProductByID(req, res)
  res.json(product)
})

router.put('/:productID', isCreator('products', 'productID', 'params'), async (req, res) => {
  const productInput = checkProductUpdate(req)
  const updatedProduct = await productService.updateProduct(productInput, req)
  res.json(updatedProduct)
})

router.post('/:productID/upload', isAdmin, multerUpload.array('productMedia', 10), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const productMedia = checkMediaUpload(req)
  productService.uploadProductImages(productMedia, req)
  res.status(204).end()
})

router.get('/:productID/parameters', async (req, res) => {
  const parameters = await parameterService.getParametersByProduct(req)
  res.json(parameters)
})

export default router
