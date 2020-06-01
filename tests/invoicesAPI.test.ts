import supertest from 'supertest'
import app from '../src/app'
import { Invoice } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneInvoice, createOneOrder, createOnePaymentMethod, invoicesInDB, loginAs, newInvoice, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.invoices

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Invoice adding', () => {
  test('201', async () => {
    const { addedPaymentMethod } = await createOnePaymentMethod('admin')
    const { addedOrder, token } = await createOneOrder('customer')

    const invoicesAtStart = await invoicesInDB()

    await api
      .post(apiURLs.invoices)
      .set('Cookie', `token=${token}`)
      .send(newInvoice(addedOrder.orderID, addedPaymentMethod.paymentMethodID, addedOrder.userID as number))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const invoicesAtEnd = await invoicesInDB()
    expect(invoicesAtEnd).toHaveLength(invoicesAtStart.length + 1)
  })
})

describe('Invoices fetching', () => {
  test('200 invoices', async () => {
    const { token } = await createOneInvoice('admin')

    const { body }: { body: Invoice[] } = await api
      .get(apiURL)
      .set('Cookie', `token=${token}`)
      .expect(200)
    expect(body).toBeDefined()
  })

  test('200 invoices by user', async () => {
    await createOneInvoice('customer')
    const { userID, token } = await loginAs('admin')

    const { body }: { body: Invoice[] } = await api
      .get(`${apiURLs.users}/${userID}/invoices`)
      .set('Cookie', `token=${token}`)
      .expect(200)
    expect(body).toBeDefined()
  })

  test('200 invoice if creator', async () => {
    const { addedInvoice, token } = await createOneInvoice('customer')

    const { body } = await api
      .get(`${apiURL}/${addedInvoice.invoiceID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Invoice updating', () => {
  test('200 if admin', async () => {
    const { addedInvoice, token } = await createOneInvoice('admin')

    const { body } = await api
      .put(`${apiURL}/${addedInvoice.invoiceID}`)
      .set('Cookie', `token=${token}`)
      .send({ details: 'Updated details' })
      .expect(200)

    expect(body.details).toBe('Updated details')
  })
})

afterAll(async () => await db.destroy())
