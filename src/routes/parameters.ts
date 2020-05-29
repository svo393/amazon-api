import Router from 'express'
import parameterService from '../services/parameterService'
import { checkNewParameters, checkProductParameter, checkParameterUpdate } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const parameterCreateInput = checkNewParameters(req)
  const addedParameter = await parameterService.addParameters(parameterCreateInput)
  res.status(201).json(addedParameter)
})

router.post('/:parameterID/product/:productID', isAdmin, async (req, res) => {
  const productParameterCreateInput = checkProductParameter(req)
  const addedProductParameter = await parameterService.addProductParameter(productParameterCreateInput, req)
  res.status(201).json(addedProductParameter)
})

router.put('/:parameterID', isAdmin, async (req, res) => {
  const parameterUpdateInput = checkParameterUpdate(req)
  const updatedItem = await parameterService.updateParameter(parameterUpdateInput, req)
  res.json(updatedItem)
})

export default router
