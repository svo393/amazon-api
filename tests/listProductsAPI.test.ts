import supertest from 'supertest'
import app from '../src/app'
import { db } from '../src/utils/db'
import { apiURLs, createOneList, createOneListProduct, createOneProduct, listProductsInDB, loginAs, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.listProducts

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('ListProduct adding', () => {
  test.only('201', async () => {
    const { listID, token } = await createOneList()
    const { addedProduct } = await createOneProduct('admin')

    const listProductsAtStart = await listProductsInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send({ listID, productID: addedProduct.productID })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const listProductsAtEnd = await listProductsInDB()
    expect(listProductsAtEnd).toHaveLength(listProductsAtStart.length + 1)
  })
})

describe('ListProducts deleting', () => {
  test('204 if same user', async () => {
    const { productID, listID, token } = await createOneListProduct()

    await api
      .delete(`${apiURL}/${listID}/${productID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })

  test('403 if another user', async () => {
    const { productID, listID } = await createOneListProduct()
    const { token } = await loginAs('admin', api)

    await api
      .delete(`${apiURL}/${listID}/${productID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
