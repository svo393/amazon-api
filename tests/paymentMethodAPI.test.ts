import supertest from 'supertest'
import app from '../src/app'
import { PaymentMethod } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { paymentMethodsInDB, createOnePaymentMethod, loginAs, newPaymentMethod, populateUsers, purge } from './testHelper'

const api = supertest(app)

const apiURL = apiURLs.paymentMethods

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('PaymentMethod adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root')
    const paymentMethodsAtStart = await paymentMethodsInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newPaymentMethod())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const paymentMethodsAtEnd = await paymentMethodsInDB()
    expect(paymentMethodsAtEnd).toHaveLength(paymentMethodsAtStart.length + 1)
  })

  test('403 if not root ar admin', async () => {
    const { token } = await loginAs('customer')

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newPaymentMethod())
      .expect(403)
  })
})

describe('PaymentMethods fetching', () => {
  test('200 paymentMethods', async () => {
    const { body }: { body: PaymentMethod[] } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 paymentMethod', async () => {
    const { addedPaymentMethod } = await createOnePaymentMethod('root')

    const { body } = await api
      .get(`${apiURL}/${addedPaymentMethod.paymentMethodID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('PaymentMethod updating', () => {
  test('200 if admin or root', async () => {
    const { addedPaymentMethod, token } = await createOnePaymentMethod('admin')

    const { body } = await api
      .put(`${apiURL}/${addedPaymentMethod.paymentMethodID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated PaymentMethod ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.name).toContain('Updated PaymentMethod')
  })

  test('403 if not admin or root', async () => {
    const { addedPaymentMethod } = await createOnePaymentMethod('root')
    const { token } = await loginAs('customer')

    await api
      .put(`${apiURL}/${addedPaymentMethod.paymentMethodID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated PaymentMethod ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
