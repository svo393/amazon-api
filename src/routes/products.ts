import Router from 'express'
import productService from '../services/productService'
import ratingService from '../services/ratingService'
import inputValidator from '../utils/inputValidator'
import { isAdmin, isCreator } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const productInput = inputValidator.checkNewProduct(req)
  const addedProduct = await productService.addProduct(productInput, res)
  res.status(201).json(addedProduct)
})

router.get('/', async (_req, res) => {
  const products = await productService.getProducts()
  res.json(products)
})

router.get('/:productID', async (req, res) => {
  const product = await productService.getProductByID(req, res)
  res.json(product)
})

router.put('/:productID', isCreator('products', 'productID', 'params'), async (req, res) => {
  const productInput = inputValidator.checkProductUpdate(req)
  const updatedProduct = await productService.updateProduct(productInput, req)
  res.json(updatedProduct)
})

router.post('/:productID/upload', isAdmin, productService.multerUpload.array('productMedia', 10), (req, res) => {
  const productMedia = inputValidator.checkProductMediaUpload(req)
  productService.uploadImages(productMedia, req)
  res.status(204).end()
})

router.get('/:productID/ratings', async (req, res) => {
  const ratings = await ratingService.getRatingsByProduct(req)
  res.json(ratings)
})

export default router
