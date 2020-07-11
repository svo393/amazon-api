import Router from 'express'
import parameterService from '../services/parameterService'
import { checkParameter } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const parameterCreateInput = checkParameter(req)
  const addedParameter = await parameterService.addParameter(parameterCreateInput)
  res.status(201).json(addedParameter)
})

router.get('/', async (_, res) => {
  const parameters = await parameterService.getParameters()
  res.json(parameters)
})

router.put('/:parameterID', isAdmin, async (req, res) => {
  const parameterUpdateInput = checkParameter(req)
  const updatedItem = await parameterService.updateParameter(parameterUpdateInput, req)
  res.json(updatedItem)
})

export default router
