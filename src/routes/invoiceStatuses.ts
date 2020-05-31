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

router.get('/', isAdmin, async (_req, res) => {
  const invoiceStatuses = await invoiceStatusService.getInvoiceStatuses()
  res.json(invoiceStatuses)
})

router.put('/:invoiceStatusID', isAdmin, async (req, res) => {
  const invoiceStatusUpdateInput = checkInvoiceStatusUpdate(req)
  const updatedInvoiceStatus = await invoiceStatusService.updateInvoiceStatus(invoiceStatusUpdateInput, req)
  res.json(updatedInvoiceStatus)
})

export default router
