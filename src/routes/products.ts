import Router from 'express'
import productService from '../services/productService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isAdmin(res)
  const productInput = inputValidator.checkNewProduct(req.body)
  const addedProduct = await productService.addProduct(productInput)
  res.status(201).json(addedProduct)
})

// router.get('/', async (_req, res) => {
//   const products = await productService.getProducts()
//   res.json(products)
// })

// router.get('/:id', async (req, res) => {
//   const product = await productService.getProductByID(req.params.id, res)
//   res.json(product)
// })

// router.put('/:id', async (req, res) => {
//   await shield.isCreator(res, 'product', req.params.id)
//   const productInput = inputValidator.checkProductUpdate(req.body)
//   const updatedProduct = await productService.updateProduct(productInput, req.params.id)
//   res.json(updatedProduct)
// })

// router.post('/:id/upload', productService.multerUpload.array('productMedia', 10), async (req, res) => {
//   shield.isAdmin(res)
//   const productMedia = inputValidator.checkProductMediaUpload(req.files)
//   productService.uploadImages(productMedia, req.params.id)
//   res.sendStatus(204)
// })

export default router
