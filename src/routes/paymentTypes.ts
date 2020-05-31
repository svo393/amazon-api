import Router from 'express'
import paymentTypeService from '../services/paymentTypeService'
import { checkPaymentType } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const paymentTypeCreateInput = checkPaymentType(req)
  const addedPaymentType = await paymentTypeService.addPaymentType(paymentTypeCreateInput)
  res.status(201).json(addedPaymentType)
})

router.get('/', async (_req, res) => {
  const paymentTypes = await paymentTypeService.getPaymentTypes()
  res.json(paymentTypes)
})

router.get('/:paymentTypeID', async (req, res) => {
  const paymentType = await paymentTypeService.getPaymentTypeByID(req)
  res.json(paymentType)
})

router.put('/:paymentTypeID', isAdmin, async (req, res) => {
  const paymentTypeUpdateInput = checkPaymentType(req)
  const updatedPaymentType = await paymentTypeService.updatePaymentType(paymentTypeUpdateInput, req)
  res.json(updatedPaymentType)
})

export default router
