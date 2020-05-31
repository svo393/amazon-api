import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneInvoiceStatus, loginAs, newInvoiceStatus, populateUsers, purge, invoiceStatusesInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.invoiceStatuses

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('InvoiceStatus adding', () => {
  test('201', async () => {
    const { token } = await loginAs('admin', api)
    const invoiceStatusesAtStart = await invoiceStatusesInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newInvoiceStatus())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const invoiceStatusesAtEnd = await invoiceStatusesInDB()
    expect(invoiceStatusesAtEnd).toHaveLength(invoiceStatusesAtStart.length + 1)
  })

  test('403 if not admin', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newInvoiceStatus())
      .expect(403)
  })
})

describe('InvoiceStatuses fetching', () => {
  test('200 invoiceStatuses', async () => {
    const { token } = await loginAs('admin', api)

    await api
      .get(apiURL)
      .set('Cookie', `token=${token}`)
      .expect(200)
  })
})

describe('InvoiceStatus updating', () => {
  test('200 if admin', async () => {
    const { addedInvoiceStatus, token } = await createOneInvoiceStatus('admin')

    const { body } = await api
      .put(`${apiURL}/${addedInvoiceStatus.invoiceStatusID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated InvoiceStatus ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.name).toContain('Updated InvoiceStatus')
  })

  test('403 if not admin', async () => {
    const { addedInvoiceStatus } = await createOneInvoiceStatus('admin')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedInvoiceStatus.invoiceStatusID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated InvoiceStatus ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
