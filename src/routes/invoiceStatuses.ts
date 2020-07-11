import Router from 'express'
import invoiceStatusService from '../services/invoiceStatusService'
import { checkNewInvoiceStatus, checkInvoiceStatusUpdate } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const invoiceStatusCreateInput = checkNewInvoiceStatus(req)
  const addedInvoiceStatus = await invoiceStatusService.addInvoiceStatus(invoiceStatusCreateInput)
  res.status(201).json(addedInvoiceStatus)
})

router.get('/', isAdmin, async (_, res) => {
  const invoiceStatuses = await invoiceStatusService.getInvoiceStatuses()
  res.json(invoiceStatuses)
})

router.put('/:invoiceStatusName', isAdmin, async (req, res) => {
  const invoiceStatusUpdateInput = checkInvoiceStatusUpdate(req)
  const updatedInvoiceStatus = await invoiceStatusService.updateInvoiceStatus(invoiceStatusUpdateInput, req)
  res.json(updatedInvoiceStatus)
})

router.delete('/:invoiceStatusName', isAdmin, async (req, res) => {
  await invoiceStatusService.deleteInvoiceStatus(req)
  res.status(204).end()
})

export default router
