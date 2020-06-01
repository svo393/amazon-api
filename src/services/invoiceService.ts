import { Request } from 'express'
import Knex from 'knex'
import { Invoice, InvoiceCreateInput, InvoiceStatus, InvoiceUpdateInput } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addInvoice = async (invoiceInput: InvoiceCreateInput): Promise<Invoice> => {
  const now = new Date()

  return await dbTrans(async (trx: Knex.Transaction) => {
    const invoiceStatusID = await trx<InvoiceStatus>('invoiceStatuses')
      .first()
      .where('name', 'NEW')

    const [ addedInvoice ]: Invoice[] = await trx('invoices')
      .insert({
        ...invoiceInput,
        invoiceStatusID: invoiceStatusID?.invoiceStatusID,
        invoiceCreatedAt: now,
        invoiceUpdatedAt: now
      }, [ '*' ])

    return addedInvoice
  })
}

const getInvoices = async (): Promise<Invoice[]> => {
  return await db('invoices')
}

const getInvoicesByUser = async (req: Request): Promise<Invoice[]> => {
  return await db('invoices')
    .where('userID', req.params.userID)
}

const getInvoiceByID = async (req: Request): Promise<Invoice> => {
  const invoice = await db<Invoice>('invoices')
    .first()
    .where('invoiceID', req.params.invoiceID)

  if (!invoice) throw new StatusError(404, 'Not Found')
  return invoice
}

const updateInvoice = async (invoiceInput: InvoiceUpdateInput, req: Request): Promise<Invoice> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const invoice: { invoiceStatusName: string } = await trx('invoices')
      .first('os.name as invoiceStatusName')
      .where('invoiceID', req.params.invoiceID)
      .joinRaw('JOIN "invoiceStatuses" as os USING ("invoiceStatusID")')

    if ([ 'DONE', 'CANCELED' ].includes(invoice.invoiceStatusName)) {
      throw new StatusError(410, 'This invoice can\'t be updated anymore')
    }

    const [ updatedInvoice ]: Invoice[] = await trx('invoices')
      .update({
        ...invoiceInput,
        invoiceUpdatedAt: new Date()
      }, [ '*' ])
      .where('invoiceID', req.params.invoiceID)

    if (!updatedInvoice) throw new StatusError(404, 'Not Found')
    return updatedInvoice
  })
}

export default {
  addInvoice,
  getInvoices,
  getInvoicesByUser,
  getInvoiceByID,
  updateInvoice
}
