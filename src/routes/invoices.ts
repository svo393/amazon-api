import Router from 'express'
import invoiceService from '../services/invoiceService'
import { checkInvoiceUpdate, checkNewInvoice, checkInvoiceFilters } from '../utils/inputValidator'
import { isAdmin, isLoggedIn, isCreatorOrAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const invoiceCreateInput = checkNewInvoice(req)
  const addedInvoice = await invoiceService.addInvoice(invoiceCreateInput)
  res.status(201).json(addedInvoice)
})

router.get('/', isAdmin, async (req, res) => {
  const invoiceFilterInput = checkInvoiceFilters(req)
  const roles = await invoiceService.getInvoices(invoiceFilterInput)
  res.json(roles)
})

router.get('/:invoiceID', isCreatorOrAdmin('invoices', 'invoiceID', 'params'), async (req, res) => {
  const invoice = await invoiceService.getInvoiceByID(req)
  res.json(invoice)
})

router.put('/:invoiceID', isAdmin, async (req, res) => {
  const invoiceUpdateInput = checkInvoiceUpdate(req)
  const updatedItem = await invoiceService.updateInvoice(invoiceUpdateInput, req)
  res.json(updatedItem)
})

export default router
