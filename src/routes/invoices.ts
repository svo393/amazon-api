import Router from 'express'
import invoiceService from '../services/invoiceService'
import {
  checkInvoiceUpdate,
  checkNewInvoice,
  checkInvoiceFilters
} from '../utils/typeGuard'
import {
  requireAdmin,
  requireAuth,
  requireCreatorOrAdmin
} from '../utils/middleware'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const invoiceCreateInput = checkNewInvoice(req)
  const addedInvoice = await invoiceService.addInvoice(
    invoiceCreateInput
  )
  res.status(201).json(addedInvoice)
})

router.get('/', requireAdmin, async (req, res) => {
  const invoicesFiltersinput = checkInvoiceFilters(req)
  const roles = await invoiceService.getInvoices(invoicesFiltersinput)
  res.json(roles)
})

router.get(
  '/:invoiceID',
  requireCreatorOrAdmin('invoices', 'invoiceID', 'params'),
  async (req, res) => {
    const invoice = await invoiceService.getInvoiceByID(req)
    res.json(invoice)
  }
)

router.put('/:invoiceID', requireAdmin, async (req, res) => {
  const invoiceUpdateInput = checkInvoiceUpdate(req)
  const updatedItem = await invoiceService.updateInvoice(
    invoiceUpdateInput,
    req
  )
  res.json(updatedItem)
})

export default router
