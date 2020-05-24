import supertest from 'supertest'
import app from '../src/app'
import { ShippingMethod, ShippingMethodInput } from '../src/types'
import db from '../src/utils/db'
import { loginAs, populateUsers, purge, shippingMethodsInDB } from './testHelper'

const api = supertest(app)

export const apiURL = '/api/shipping-methods'

const newShippingMethod = (): ShippingMethodInput => ({
  name: `New ShippingMethod ${(new Date().getTime()).toString()}`
})

export const createOneShippingMethod = async (shippingMethod: string): Promise<{ addedShippingMethod: ShippingMethod; token: string}> => {
  const { token } = await loginAs(shippingMethod, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(newShippingMethod())

  return { addedShippingMethod: body, token }
}

beforeEach(async () => {
  await purge()
  await populateUsers(api)
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
  test('200 shippingMethods without sensitive info if not root ar admin', async () => {
    const { body }: { body: ShippingMethod[] } = await api
      .get(apiURL)
      .expect(200)

    const emails = body.map((sm) => sm.name)
    expect(emails).not.toContain('DOOR')
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
