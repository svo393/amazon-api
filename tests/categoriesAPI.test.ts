import supertest from 'supertest'
import app from '../src/app'
import { db } from '../src/utils/db'
import { categoriesInDB, createOneCategory, loginAs, newCategory, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = '/api/categories'

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Category adding', () => {
  test('201', async () => {
    const { token } = await loginAs('admin', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newCategory())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const categoriesAtEnd = await categoriesInDB()
    expect(categoriesAtEnd).toHaveLength(1)
  })

  test('403 if not admin or root', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newCategory())
      .expect(403)
  })
})

describe('Category fetching', () => {
  test('200 categories', async () => {
    await createOneCategory('admin')

    const { body } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 category', async () => {
    const { addedCategory } = await createOneCategory('admin')

    const { body } = await api
      .get(`${apiURL}/${addedCategory.categoryID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Category updating', () => {
  test('200 if admin or root', async () => {
    const { addedCategory, token } = await createOneCategory('admin')

    const { body } = await api
      .put(`${apiURL}/${addedCategory.categoryID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Category' })
      .expect(200)

    expect(body.name).toBe('Updated Category')
  })

  test('403 if not admin or root', async () => {
    const { addedCategory } = await createOneCategory('admin')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedCategory.categoryID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Category' })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
