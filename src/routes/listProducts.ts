import Router from 'express'
import listProductsService from '../services/listProductService'
import inputValidator from '../utils/inputValidator'
import { isCreator } from '../utils/middleware'

const router = Router()

router.post('/', isCreator('lists', 'listID', 'body'), async (req, res) => {
  const listProductCreateInput = inputValidator.checkListProduct(req.body)
  const addedListProduct = await listProductsService.addListProduct(listProductCreateInput)
  res.status(201).json(addedListProduct)
})

router.delete('/:listID/:productID', isCreator('lists', 'listID', 'params'), async (req, res) => {
  await listProductsService.deleteListProduct(Number(req.params.listID), Number(req.params.productID))
  res.status(204).end()
})

export default router
