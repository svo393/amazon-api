import Router from 'express'
import paymentMethodService from '../services/paymentMethodService'
import { checkPaymentMethod } from '../utils/inputValidator'
import { requireAdmin } from '../utils/middleware'

const router = Router()

router.post('/', requireAdmin, async (req, res) => {
  const paymentMethodCreateInput = checkPaymentMethod(req)
  const addedPaymentMethod = await paymentMethodService.addPaymentMethod(
    paymentMethodCreateInput
  )
  res.status(201).json(addedPaymentMethod)
})

router.get('/', async (_, res) => {
  const paymentMethods = await paymentMethodService.getPaymentMethods()
  res.json(paymentMethods)
})

router.get('/:paymentMethodName', async (req, res) => {
  const paymentMethod = await paymentMethodService.getPaymentMethodByName(
    req
  )
  res.json(paymentMethod)
})

router.put('/:paymentMethodName', requireAdmin, async (req, res) => {
  const paymentMethodUpdateInput = checkPaymentMethod(req)
  const updatedPaymentMethod = await paymentMethodService.updatePaymentMethod(
    paymentMethodUpdateInput,
    req
  )
  res.json(updatedPaymentMethod)
})

router.delete(
  '/:paymentMethodName',
  requireAdmin,
  async (req, res) => {
    await paymentMethodService.deletePaymentMethod(req)
    res.status(204).end()
  }
)

export default router
