import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneGroup, loginAs, newGroup, populateUsers, purge, groupsInDB, createOneProduct, groupProductsInDB, newGroupProduct, createOneGroupProduct } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.groups

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Group adding', () => {
  test('201', async () => {
    const { token } = await loginAs('admin', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newGroup())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const groupsAtEnd = await groupsInDB()
    expect(groupsAtEnd).toHaveLength(1)
  })

  test('403 if not admin or root', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newGroup())
      .expect(403)
  })

  test('201 groupProduct', async () => {
    const { addedGroup, token } = await createOneGroup('admin')
    const { addedProduct } = await createOneProduct('admin')

    const groupsAtStart = await groupProductsInDB()

    await api
      .post(`${apiURL}/${addedGroup.groupID}/product/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send(newGroupProduct(addedGroup.groupID, addedProduct.productID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const groupsAtEnd = await groupProductsInDB()
    expect(groupsAtEnd).toHaveLength(groupsAtStart.length + 1)
  })
})

describe('Group fetching', () => {
  test('200 groups by product', async () => {
    const { addedGroupProduct } = await createOneGroupProduct('admin')

    const { body } = await api
      .get(`${apiURLs.products}/${addedGroupProduct.productID}/groups`)
      .expect(200)
    expect(body).toBeDefined()
  })
})

describe('Group updating', () => {
  test('200 if admin or root', async () => {
    const { addedGroup, token } = await createOneGroup('admin')

    const { body } = await api
      .put(`${apiURL}/${addedGroup.groupID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Group' })
      .expect(200)

    expect(body.name).toBe('Updated Group')
  })

  test('403 if not admin or root', async () => {
    const { addedGroup } = await createOneGroup('admin')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedGroup.groupID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Group' })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
