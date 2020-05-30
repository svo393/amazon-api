import Router from 'express'
import groupService from '../services/groupService'
import parameterService from '../services/parameterService'
import productService from '../services/productService'
import questionService from '../services/questionService'
import ratingService from '../services/ratingService'
import { checkNewProduct, checkMediaUpload, checkProductUpdate } from '../utils/inputValidator'
import { isAdmin, isCreator, multerUpload } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const productInput = checkNewProduct(req)
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
  const productInput = checkProductUpdate(req)
  const updatedProduct = await productService.updateProduct(productInput, req)
  res.json(updatedProduct)
})

router.post('/:productID/upload', isAdmin, multerUpload.array('productMedia', 10), (req, res) => {
  const productMedia = checkMediaUpload(req)
  productService.uploadProductImages(productMedia, req)
  res.status(204).end()
})

router.get('/:productID/ratings', async (req, res) => {
  const ratings = await ratingService.getRatingsByProduct(req)
  res.json(ratings)
})

router.get('/:productID/questions', async (req, res) => {
  const questions = await questionService.getQuestionsByProduct(req)
  res.json(questions)
})

router.get('/:productID/groups', async (req, res) => {
  const groups = await groupService.getGroupsByProduct(req)
  res.json(groups)
})

router.get('/:productID/parameters', async (req, res) => {
  const parameters = await parameterService.getParametersByProduct(req)
  res.json(parameters)
})

router.delete('/:productID', isAdmin, async (req, res) => {
  await productService.deleteProduct(req)
  res.status(204).end()
})

export default router
