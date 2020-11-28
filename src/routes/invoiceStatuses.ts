import Router from 'express'
import invoiceStatusService from '../services/invoiceStatusService'
import { checkInvoiceStatus } from '../utils/typeGuard'
import { requireAdmin } from '../utils/middleware'

const router = Router()

router.post('/', requireAdmin, async (req, res) => {
  const invoiceStatusCreateInput = checkInvoiceStatus(req)
  const addedInvoiceStatus = await invoiceStatusService.addInvoiceStatus(
    invoiceStatusCreateInput
  )
  res.status(201).json(addedInvoiceStatus)
})

router.get('/', requireAdmin, async (_, res) => {
  const invoiceStatuses = await invoiceStatusService.getInvoiceStatuses()
  res.json(invoiceStatuses)
})

router.put('/:invoiceStatusName', requireAdmin, async (req, res) => {
  const invoiceStatusUpdateInput = checkInvoiceStatus(req)
  const updatedInvoiceStatus = await invoiceStatusService.updateInvoiceStatus(
    invoiceStatusUpdateInput,
    req
  )
  res.json(updatedInvoiceStatus)
})

router.delete(
  '/:invoiceStatusName',
  requireAdmin,
  async (req, res) => {
    await invoiceStatusService.deleteInvoiceStatus(req)
    res.status(204).end()
  }
)

export default router
