import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneProduct, groupVariantsInDB, loginAs, newGroupVariant, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.groups

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Group adding', () => {
  test('201 GroupVariant', async () => {
    const { addedProduct, token } = await createOneProduct('admin')

    const groupsAtStart = await groupVariantsInDB()

    await api
      .post(`${apiURL}/${addedProduct.groupID}/product/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send(newGroupVariant())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const groupsAtEnd = await groupVariantsInDB()
    expect(groupsAtEnd).toHaveLength(groupsAtStart.length + 1)
  })
})

describe('Group variant updating', () => {
  test('200 if admin or root', async () => {
    const { addedProduct, token } = await createOneProduct('admin')

    const product = await api
      .get(`${apiURLs.products}/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)

    const { body } = await api
      .put(`${apiURL}/${product.body.groupID}/product/${product.body.productID}/name/${product.body.group[0].name}`)
      .set('Cookie', `token=${token}`)
      .send({ value: 'Updated Group Variant' })
      .expect(200)

    expect(body.value).toBe('Updated Group Variant')
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
      .send({ value: 'Updated Group Variant' })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
