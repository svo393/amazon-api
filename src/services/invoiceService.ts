import { Request } from 'express'
import Knex from 'knex'
import { Invoice, InvoiceCreateInput, InvoiceUpdateInput } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addInvoice = async (invoiceInput: InvoiceCreateInput): Promise<Invoice> => {
  const now = new Date()

  const [ addedInvoice ]: Invoice[] = await db('invoices')
    .insert({
      ...invoiceInput,
      invoiceStatus: 'NEW',
      invoiceCreatedAt: now,
      invoiceUpdatedAt: now
    }, [ '*' ])

  return addedInvoice
}

const getInvoices = async ({ query: queryArgs }: Request): Promise<Invoice[]> => {
  const query = db<Invoice>('invoices')

  queryArgs.invoiceStatuses &&
  query.where('invoiceStatus', 'in', queryArgs.invoiceStatuses.toString().split(','))

  queryArgs.paymentMethods &&
  query.where('paymentMethod', 'in', queryArgs.paymentMethods.toString().split(','))

  queryArgs.amountMin &&
  query.where('amount', '>=', Number(queryArgs.amountMin) * 100)

  queryArgs.amountMax &&
  query.where('amount', '<=', Number(queryArgs.amountMax) * 100)

  return await query
}

const getInvoicesByUser = async (req: Request): Promise<Invoice[]> => {
  return await db('invoices')
    .where('userID', req.params.userID)
}

const getInvoiceByID = async (req: Request): Promise<Invoice> => {
  const invoice = await db<Invoice>('invoices as i')
    .first(
      'i.invoiceID',
      'i.amount',
      'i.details',
      'i.invoiceCreatedAt',
      'i.invoiceUpdatedAt',
      'i.orderID',
      'i.userID',
      'i.invoiceStatus',
      'i.paymentMethod',
      'u.email as userEmail'
    )
    .where('invoiceID', req.params.invoiceID)
    .joinRaw('JOIN users as u USING ("userID")')

  if (!invoice) throw new StatusError(404, 'Not Found')
  return invoice
}

const updateInvoice = async (invoiceInput: InvoiceUpdateInput, req: Request): Promise<Invoice> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const invoice: { invoiceStatusName: string } = await trx('invoices as i')
      .first('is.invoiceStatusName')
      .where('invoiceID', req.params.invoiceID)
      .join('invoiceStatuses as is', 'i.invoiceStatus', 'is.invoiceStatusName')

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
