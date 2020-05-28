import Router from 'express'
import productService from '../services/productService'
import inputValidator from '../utils/inputValidator'
import { isAdmin, isCreator } from '../utils/middleware'
import ratingService from '../services/ratingService'

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
  const product = await productService.getProductByID(Number(req.params.productID), res)
  res.json(product)
})

router.put('/:productID', isCreator('products', 'productID', 'params'), async (req, res) => {
  const productInput = inputValidator.checkProductUpdate(req)
  const updatedProduct = await productService.updateProduct(productInput, Number(req.params.productID))
  res.json(updatedProduct)
})

router.post('/:productID/upload', isAdmin, productService.multerUpload.array('productMedia', 10), (req, res) => {
  const productMedia = inputValidator.checkProductMediaUpload(req)
  productService.uploadImages(productMedia, Number(req.params.productID))
  res.sendStatus(204)
})

router.get('/:productID/ratings', async (req, res) => {
  const ratings = await ratingService.getRatingsByProduct(req)
  res.json(ratings)
})

export default router
