import { Request } from 'express'
import { InvoiceStatus, InvoiceStatusInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addInvoiceStatus = async (invoiceStatusInput: InvoiceStatusInput): Promise<InvoiceStatus> => {
  const { rows: [ addedInvoiceStatus ] }: { rows: InvoiceStatus[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('invoiceStatuses').insert(invoiceStatusInput) ]
  )

  if (!addedInvoiceStatus) {
    throw new StatusError(409, `InvoiceStatus with name "${invoiceStatusInput.name}" already exists`)
  }
  return addedInvoiceStatus
}

const getInvoiceStatuses = async (): Promise<InvoiceStatus[]> => {
  return await db('invoiceStatuses')
}

const updateInvoiceStatus = async (invoiceStatusInput: InvoiceStatusInput, req: Request): Promise<InvoiceStatus> => {
  const [ updatedInvoiceStatus ]: InvoiceStatus[] = await db('invoiceStatuses')
    .update(invoiceStatusInput, [ '*' ])
    .where('invoiceStatusID', req.params.invoiceStatusID)

  if (!updatedInvoiceStatus) throw new StatusError(404, 'Not Found')
  return updatedInvoiceStatus
}

const deleteInvoiceStatus = async (req: Request): Promise<void> => {
  const deleteCount = await db('invoiceStatuses')
    .del()
    .where('invoiceStatusID', req.params.invoiceStatusID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addInvoiceStatus,
  getInvoiceStatuses,
  updateInvoiceStatus,
  deleteInvoiceStatus
}
