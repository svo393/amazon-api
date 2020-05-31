import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneOrderStatus, loginAs, newOrderStatus, populateUsers, purge, orderStatusesInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.orderStatuses

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('OrderStatus adding', () => {
  test('201', async () => {
    const { token } = await loginAs('admin', api)
    const orderStatusesAtStart = await orderStatusesInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newOrderStatus())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const orderStatusesAtEnd = await orderStatusesInDB()
    expect(orderStatusesAtEnd).toHaveLength(orderStatusesAtStart.length + 1)
  })

  test('403 if not admin', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newOrderStatus())
      .expect(403)
  })
})

describe('OrderStatuses fetching', () => {
  test('200 orderStatuses', async () => {
    const { token } = await loginAs('admin', api)

    await api
      .get(apiURL)
      .set('Cookie', `token=${token}`)
      .expect(200)
  })
})

describe('OrderStatus updating', () => {
  test('200 if admin', async () => {
    const { addedOrderStatus, token } = await createOneOrderStatus('admin')

    const { body } = await api
      .put(`${apiURL}/${addedOrderStatus.orderStatusID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated OrderStatus ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.name).toContain('Updated OrderStatus')
  })

  test('403 if not admin', async () => {
    const { addedOrderStatus } = await createOneOrderStatus('admin')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedOrderStatus.orderStatusID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated OrderStatus ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
