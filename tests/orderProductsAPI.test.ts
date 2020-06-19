import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneOrder, createOneOrderProduct, createOneProduct, newOrderProduct, orderProductsInDB, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.orders

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('OrderProduct adding', () => {
  test('201', async () => {
    const { addedProduct } = await createOneProduct('admin')
    const { addedOrder, token } = await createOneOrder('admin')

    const orderProductsAtStart = await orderProductsInDB()

    await api
      .post(`${apiURL}/${addedOrder.orderID}/products`)
      .set('Cookie', `token=${token}`)
      .send(newOrderProduct(addedProduct))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const orderProductsAtEnd = await orderProductsInDB()
    expect(orderProductsAtEnd).toHaveLength(orderProductsAtStart.length + 1)
  })
})

describe('OrderProduct updating', () => {
  test('200 if admin', async () => {
    const { addedOrderProduct, token } = await createOneOrderProduct('admin')

    const { body } = await api
      .put(`${apiURL}/${addedOrderProduct.orderID}/products/${addedOrderProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send({ qty: 1 })
      .expect(200)

    expect(body.qty).toBe(1)
  })

  test('403 if not admin', async () => {
    const { addedOrderProduct, token } = await createOneOrderProduct('customer')

    await api
      .put(`${apiURL}/${addedOrderProduct.orderID}/products/${addedOrderProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send({ qty: 1 })
      .expect(403)
  })
})

describe('OrderProducts deleting', () => {
  test('204 if admin', async () => {
    const { addedOrderProduct, token } = await createOneOrderProduct('admin')

    await api
      .delete(`${apiURL}/${addedOrderProduct.orderID}/products/${addedOrderProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })

  test('403 if not admin', async () => {
    const { addedOrderProduct, token } = await createOneOrderProduct('customer')

    await api
      .delete(`${apiURL}/${addedOrderProduct.orderID}/products/${addedOrderProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
