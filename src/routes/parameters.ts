import Router from 'express'
import parameterService from '../services/parameterService'
import { checkNewParameters, checkProductParameter, checkParameterUpdate } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/batch', isAdmin, async (req, res) => {
  const parametersCreateInput = checkNewParameters(req)
  const addedParameters = await parameterService.addParameters(parametersCreateInput)
  res.status(201).json(addedParameters)
})

router.get('/', async (req, res) => {
  const parameters = await parameterService.getParameters()
  res.json(parameters)
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
