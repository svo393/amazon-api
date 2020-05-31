import supertest from 'supertest'
import app from '../src/app'
import { PaymentType } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { paymentTypesInDB, createOnePaymentType, loginAs, newPaymentType, populateUsers, purge } from './testHelper'

const api = supertest(app)

const apiURL = apiURLs.paymentTypes

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('PaymentType adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root', api)
    const paymentTypesAtStart = await paymentTypesInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newPaymentType())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const paymentTypesAtEnd = await paymentTypesInDB()
    expect(paymentTypesAtEnd).toHaveLength(paymentTypesAtStart.length + 1)
  })

  test('403 if not root ar admin', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newPaymentType())
      .expect(403)
  })
})

describe('PaymentTypes fetching', () => {
  test('200 paymentTypes', async () => {
    const { body }: { body: PaymentType[] } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 paymentType', async () => {
    const { addedPaymentType } = await createOnePaymentType('root')

    const { body } = await api
      .get(`${apiURL}/${addedPaymentType.paymentTypeID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('PaymentType updating', () => {
  test('200 if admin or root', async () => {
    const { addedPaymentType, token } = await createOnePaymentType('admin')

    const { body } = await api
      .put(`${apiURL}/${addedPaymentType.paymentTypeID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated PaymentType ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.name).toContain('Updated PaymentType')
  })

  test('403 if not admin or root', async () => {
    const { addedPaymentType } = await createOnePaymentType('root')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedPaymentType.paymentTypeID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated PaymentType ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
