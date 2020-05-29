import Router from 'express'
import parameterService from '../services/parameterService'
import inputValidator from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const parameterCreateInput = inputValidator.checkParameter(req)
  const addedParameter = await parameterService.addParameter(parameterCreateInput)
  res.status(201).json(addedParameter)
})

router.get('/', async (_req, res) => {
  const parameters = await parameterService.getParameters()
  res.json(parameters)
})

router.get('/:parameterID', async (req, res) => {
  const parameter = await parameterService.getParameterByID(req)
  res.json(parameter)
})

router.put('/:parameterID', isAdmin, async (req, res) => {
  const parameterUpdateInput = inputValidator.checkParameter(req)
  const updatedItem = await parameterService.updateParameter(parameterUpdateInput, req)
  res.json(updatedItem)
})

export default router
