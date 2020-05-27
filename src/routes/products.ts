import Router from 'express'
import productService from '../services/productService'
import inputValidator from '../utils/inputValidator'
import { isAdmin, isCreator } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const productInput = inputValidator.checkNewProduct(req.body)
  const addedProduct = await productService.addProduct(productInput, res)
  res.status(201).json(addedProduct)
})

router.get('/', async (_req, res) => {
  const products = await productService.getProducts()
  res.json(products)
})

router.get('/:productID', async (req, res) => {
  const product = await productService.getProductByID(Number(req.params.productID), res)
  res.json(product)
})

router.put('/:productID', isCreator('products', 'productID', 'params'), async (req, res) => {
  const productInput = inputValidator.checkProductUpdate(req.body)
  const updatedProduct = await productService.updateProduct(productInput, Number(req.params.productID))
  res.json(updatedProduct)
})

router.post('/:productID/upload', isAdmin, productService.multerUpload.array('productMedia', 10), (req, res) => {
  const productMedia = inputValidator.checkProductMediaUpload(req.files)
  productService.uploadImages(productMedia, Number(req.params.productID))
  res.sendStatus(204)
})

export default router
