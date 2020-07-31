import { Request } from 'express'
import Knex from 'knex'
import { Invoice, InvoiceCreateInput, InvoicesFiltersInput, InvoiceUpdateInput } from '../types'
import { defaultLimit } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import sortItems from '../utils/sortItems'
import StatusError from '../utils/StatusError'

const addInvoice = async (invoiceInput: InvoiceCreateInput): Promise<Invoice> => {
  const now = new Date()

  const [ addedInvoice ]: Invoice[] = await db('invoices')
    .insert({
      ...invoiceInput,
      amount: invoiceInput.amount * 100,
      invoiceStatus: 'NEW',
      createdAt: now,
      updatedAt: now
    }, [ '*' ])

  return addedInvoice
}

const getInvoices = async (invoicesFiltersinput: InvoicesFiltersInput): Promise<{ batch: Invoice[]; totalCount: number }> => {
  const {
    page = 1,
    sortBy = 'createdAt_desc',
    invoiceStatuses,
    paymentMethods,
    amountMin,
    amountMax,
    createdFrom,
    createdTo,
    userEmail
  } = invoicesFiltersinput

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

  invoices = invoices.map((i) => ({ ...i, amount: i.amount / 100 }))

  if (invoiceStatuses !== undefined) {
    invoices = invoices
      .filter((i) => invoiceStatuses.split(',').includes(i.invoiceStatus))
  }

  if (paymentMethods !== undefined) {
    invoices = invoices
      .filter((i) => paymentMethods.split(',').includes(i.paymentMethod))
  }

  if (amountMin !== undefined) {
    invoices = invoices
      .filter((i) => i.amount >= amountMin)
  }

  if (amountMax !== undefined) {
    invoices = invoices
      .filter((i) => i.amount <= amountMax)
  }

  if (createdFrom !== undefined) {
    invoices = invoices
      .filter((i) => i.createdAt >= new Date(createdFrom))
  }

  if (createdTo !== undefined) {
    invoices = invoices
      .filter((i) => i.createdAt <= new Date(createdTo))
  }

  if (userEmail !== undefined) {
    invoices = invoices
      .filter((i) => i.userEmail?.toLowerCase().includes(userEmail.toLowerCase()))
  }

  const invoicesSorted = sortItems(invoices, sortBy)

  return {
    batch: invoicesSorted.slice((page - 1) * defaultLimit, (page - 1) * defaultLimit + defaultLimit),
    totalCount: invoices.length
  }
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

  if (invoice === undefined) throw new StatusError(404, 'Not Found')
  return { ...invoice, amount: invoice.amount / 100 }
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
        amount: invoiceInput.amount !== undefined
          ? invoiceInput.amount * 100
          : undefined,
        updatedAt: new Date()
      }, [ '*' ])
      .where('invoiceID', req.params.invoiceID)

    if (updatedInvoice === undefined) throw new StatusError(404, 'Not Found')
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
