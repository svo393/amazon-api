import supertest from 'supertest'
import app from '../src/app'
import { Order } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneOrder, ordersInDB, loginAs, newOrder, populateUsers, purge, createOneShippingMethod, createOneAddress } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.orders

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Order adding', () => {
  test('201', async () => {
    const { addedShippingMethod } = await createOneShippingMethod('admin')
    const { addedAddress, token, userID } = await createOneAddress('customer')

    const ordersAtStart = await ordersInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newOrder(addedAddress.addr, addedShippingMethod.shippingMethodID, userID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const ordersAtEnd = await ordersInDB()
    expect(ordersAtEnd).toHaveLength(ordersAtStart.length + 1)
  })
})

describe('Orders fetching', () => {
  test('200 orders', async () => {
    const { token } = await createOneOrder('admin')

    const { body }: { body: Order[] } = await api
      .get(apiURL)
      .set('Cookie', `token=${token}`)
      .expect(200)
    expect(body).toBeDefined()
  })

  test('200 orders by user', async () => {
    const { userID, token } = await createOneOrder('admin')

    const { body }: { body: Order[] } = await api
      .get(`${apiURLs.users}/${userID}/orders`)
      .set('Cookie', `token=${token}`)
      .expect(200)
    expect(body).toBeDefined()
  })

  test('200 order if creator', async () => {
    const { orderID, token } = await createOneOrder('customer')

    const { body } = await api
      .get(`${apiURL}/${orderID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Order updating', () => {
  test('200 if creator', async () => {
    const { orderID, token } = await createOneOrder('customer')

    const { body } = await api
      .put(`${apiURL}/${orderID}`)
      .set('Cookie', `token=${token}`)
      .send({ address: 'Updated Address' })
      .expect(200)

    expect(body.address).toBe('Updated Address')
  })
})

afterAll(async () => await db.destroy())