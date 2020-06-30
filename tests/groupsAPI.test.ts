import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneProduct, groupVariationsInDB, loginAs, newGroupVariation, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.groups

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Group adding', () => {
  test('201 GroupVariation', async () => {
    const { addedProduct, token } = await createOneProduct('admin')

    const groupsAtStart = await groupVariationsInDB()

    await api
      .post(`${apiURL}/${addedProduct.groupID}/product/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send(newGroupVariation())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const groupsAtEnd = await groupVariationsInDB()
    expect(groupsAtEnd).toHaveLength(groupsAtStart.length + 1)
  })
})

describe('Group variation updating', () => {
  test('200 if admin or root', async () => {
    const { addedProduct, token } = await createOneProduct('admin')

    const product = await api
      .get(`${apiURLs.products}/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)

    const { body } = await api
      .put(`${apiURL}/${product.body.groupID}/product/${product.body.productID}/name/${product.body.group[0].name}`)
      .set('Cookie', `token=${token}`)
      .send({ value: 'Updated Group Variation' })
      .expect(200)

    expect(body.value).toBe('Updated Group Variation')
  })

  test('403 if not admin or root', async () => {
    const { addedProduct } = await createOneProduct('admin')
    const { token } = await loginAs('customer')

    const product = await api
      .get(`${apiURLs.products}/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)

    await api
      .put(`${apiURL}/${product.body.groupID}/product/${product.body.productID}/name/${product.body.group[0].name}`)
      .set('Cookie', `token=${token}`)
      .send({ value: 'Updated Group Variation' })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
