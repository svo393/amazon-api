import Router from 'express'
import cartProductService from '../services/cartProductService'
import parameterService from '../services/parameterService'
import productService from '../services/productService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import {
  checkHistory,
  checkLocalCart,
  checkMediaUpload,
  checkNewProduct,
  checkProductByID,
  checkProductFilters,
  checkProductMinFilters,
  checkProductUpdate
} from '../utils/typeGuard'
import { multerUpload, requireAdmin } from '../utils/middleware'

const router = Router()

router.post('/', requireAdmin, async (req, res) => {
  const productInput = checkNewProduct(req)
  const addedProduct = await productService.addProduct(
    productInput,
    req
  )
  res.status(201).json(addedProduct)
})

router.get('/', async (req, res) => {
  const productsFiltersInput = checkProductFilters(req)
  const products = await productService.getProducts(
    productsFiltersInput,
    req
  )
  res.json(products)
})

router.get('/min', async (req, res) => {
  const productsMinFiltersInput = checkProductMinFilters(req)
  const products = await productService.getProductsMin(
    productsMinFiltersInput
  )
  res.json(products)
})

router.get('/history', async (req, res) => {
  const historyInput = checkHistory(req)
  const products = await productService.getHistoryProducts(
    historyInput
  )
  res.json(products)
})

router.get('/:productID', async (req, res) => {
  const productByIDInput = checkProductByID(req)
  const product = await productService.getProductByID(
    productByIDInput,
    req
  )
  res.json(product)
})

router.put('/:productID', requireAdmin, async (req, res) => {
  const productInput = checkProductUpdate(req)
  const updatedProduct = await productService.updateProduct(
    productInput,
    req
  )
  res.json(updatedProduct)
})

router.post(
  '/:productID/upload',
  requireAdmin,
  multerUpload.array('productImages', 10),
  (req, res) => {
    req.socket.setTimeout(UPLOAD_TIMEOUT)
    const productImages = checkMediaUpload(req)
    productService.uploadProductImages(productImages, req)
    res.status(204).end()
  }
)

router.get('/:productID/parameters', async (req, res) => {
  const productParameters = await parameterService.getParametersByProduct(
    req
  )
  res.json(productParameters)
})

router.post('/localCart', async (req, res) => {
  const localCartProductInput = checkLocalCart(req)
  const cartProducts = await cartProductService.getProductsForLocalCart(
    localCartProductInput
  )
  res.json(cartProducts)
})

export default router
