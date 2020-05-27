import supertest from 'supertest'
import app from '../src/app'
import { ShippingMethod } from '../src/types'
import { db } from '../src/utils/db'
import { apiURLs, createOneShippingMethod, loginAs, newShippingMethod, populateUsers, purge, shippingMethodsInDB } from './testHelper'

const api = supertest(app)

const apiURL = apiURLs.shippingMethods

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('ShippingMethod adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root', api)
    const shippingMethodsAtStart = await shippingMethodsInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newShippingMethod())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const shippingMethodsAtEnd = await shippingMethodsInDB()
    expect(shippingMethodsAtEnd).toHaveLength(shippingMethodsAtStart.length + 1)
  })

  test('403 if not root ar admin', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newShippingMethod())
      .expect(403)
  })
})

describe('ShippingMethods fetching', () => {
  test('200 shippingMethods', async () => {
    const { body }: { body: ShippingMethod[] } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 shippingMethod', async () => {
    const { addedShippingMethod } = await createOneShippingMethod('root')

    const { body } = await api
      .get(`${apiURL}/${addedShippingMethod.shippingMethodID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('ShippingMethod updating', () => {
  test('200 if admin or root', async () => {
    const { addedShippingMethod, token } = await createOneShippingMethod('admin')

    const { body } = await api
      .put(`${apiURL}/${addedShippingMethod.shippingMethodID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated ShippingMethod ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.name).toContain('Updated ShippingMethod')
  })

  test('403 if not admin or root', async () => {
    const { addedShippingMethod } = await createOneShippingMethod('root')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedShippingMethod.shippingMethodID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated ShippingMethod ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
