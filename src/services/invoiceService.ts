import { Request } from 'express'
import Knex from 'knex'
import { Invoice, InvoiceCreateInput, InvoiceFiltersInput, InvoiceUpdateInput } from '../types'
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

const getInvoices = async (invoiceFilterInput: InvoiceFiltersInput): Promise<Invoice[]> => {
  const {
    invoiceStatuses,
    paymentMethods,
    amountMin,
    amountMax,
    createdFrom,
    createdTo,
    userEmail
  } = invoiceFilterInput

  let invoices: Invoice[] = await db('invoices as i')
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

  if (typeof (invoiceStatuses) !== 'undefined') {
    invoices = invoices
      .filter((i) => invoiceStatuses.split(',').includes(i.invoiceStatus))
  }

  if (typeof (paymentMethods) !== 'undefined') {
    invoices = invoices
      .filter((i) => paymentMethods.split(',').includes(i.paymentMethod))
  }

  if (typeof (amountMin) !== 'undefined') {
    invoices = invoices
      .filter((i) => i.amount >= amountMin)
  }

  if (typeof (amountMax) !== 'undefined') {
    invoices = invoices
      .filter((i) => i.amount <= amountMax)
  }

  if (typeof (createdFrom) !== 'undefined') {
    invoices = invoices
      .filter((i) => i.createdAt >= new Date(createdFrom))
  }

  if (typeof (createdTo) !== 'undefined') {
    invoices = invoices
      .filter((i) => i.createdAt <= new Date(createdTo))
  }

  if (typeof (userEmail) !== 'undefined') {
    invoices = invoices
      .filter((i) => i.userEmail?.toLowerCase().includes(userEmail.toLowerCase()))
  }

  return invoices
}

const getInvoicesByUser = async (req: Request): Promise<Invoice[]> => {
  return await db('invoices')
    .where('userID', req.params.userID)
}

const getInvoiceByID = async (req: Request): Promise<Invoice> => {
  const invoice: Invoice = await db('invoices as i')
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

  if (typeof (invoice) === 'undefined') throw new StatusError(404, 'Not Found')
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

    if (typeof (updatedInvoice) === 'undefined') throw new StatusError(404, 'Not Found')
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
