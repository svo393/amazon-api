import { Request } from 'express'
import Knex from 'knex'
import R from 'ramda'
import { Invoice, InvoiceCreateInput, InvoiceUpdateInput } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addInvoice = async (invoiceInput: InvoiceCreateInput): Promise<Invoice> => {
  const now = new Date()

  const [ addedInvoice ]: Invoice[] = await db('invoices')
    .insert({
      ...invoiceInput,
      invoiceStatus: 'NEW',
      createdAt: now,
      updatedAt: now
    }, [ '*' ])

  return addedInvoice
}

const getInvoices = async ({ query: queryArgs }: Request): Promise<Invoice[]> => {
  let invoices: Invoice[] = await db<Invoice>('invoices as i')
    .select(
      'i.invoiceID',
      'i.amount',
      'i.details',
      'i.createdAt',
      'i.updatedAt',
      'u.email as userEmail',
      'i.orderID',
      'i.userID',
      'i.invoiceStatus',
      'i.paymentMethod'
    )
    .join('users as u', 'i.userID', 'u.userID')
    .groupBy('i.invoiceID', 'userEmail')

  if ('invoiceStatuses' in queryArgs && !R.isEmpty(queryArgs.invoiceStatuses)) {
    invoices = invoices.filter((o) =>
      queryArgs.invoiceStatuses.toString().split(',').includes(o.invoiceStatus)
    )
  }

  if ('paymentMethods' in queryArgs && !R.isEmpty(queryArgs.paymentMethods)) {
    invoices = invoices.filter((o) =>
      queryArgs.paymentMethods.toString().split(',').includes(o.paymentMethod)
    )
  }

  if ('amountMin' in queryArgs && !R.isEmpty(queryArgs.amountMin)) {
    invoices = invoices.filter((o) =>
      o.amount >= Number(queryArgs.amountMin)
    )
  }

  if ('amountMax' in queryArgs && !R.isEmpty(queryArgs.amountMax)) {
    invoices = invoices.filter((o) =>
      o.amount <= Number(queryArgs.amountMax)
    )
  }

  if ('createdFrom' in queryArgs && !R.isEmpty(queryArgs.createdFrom)) {
    invoices = invoices.filter((o) =>
      o.createdAt >= new Date(queryArgs.createdFrom.toString())
    )
  }

  if ('createdTo' in queryArgs && !R.isEmpty(queryArgs.createdTo)) {
    invoices = invoices.filter((o) =>
      o.createdAt <= new Date(queryArgs.createdTo.toString())
    )
  }

  if ('userEmail' in queryArgs && !R.isEmpty(queryArgs.userEmail)) {
    invoices = invoices.filter((o) =>
        o.userEmail?.toLowerCase().includes(queryArgs.userEmail.toString().toLowerCase())
    )
  }

  return invoices
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
      'i.createdAt',
      'i.updatedAt',
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
        updatedAt: new Date()
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
