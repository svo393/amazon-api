import { CategoryCreateInput } from '@prisma/client'
import supertest from 'supertest'
import app from '../src/app'
import { categoriesInDB, loginAs, populateUsers } from './testHelper'

const api = supertest(app)
const apiURL = '/api/categories'

const newCategory = (): CategoryCreateInput => ({
  name: `New Category ${(new Date().getTime()).toString()}`
})

const createOneCategory = async (role: string): Promise<any> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(newCategory())

  return { addedCategory: body, token }
}

beforeEach(async () => {
  await populateUsers()
})

describe('Category adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root', api)

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
    await api
      .post(apiURL)
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
      .get(`${apiURL}/${addedCategory.id}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Category updating', () => {
  test('200 if admin or root', async () => {
    const { addedCategory, token } = await createOneCategory('admin')

    const { body } = await api
      .put(`${apiURL}/${addedCategory.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Category' })
      .expect(200)

    expect(body.name).toBe('Updated Category')
  })

  test('403 if not admin or root', async () => {
    const { addedCategory } = await createOneCategory('admin')
    const { token } = await createOneCategory('customer')

    await api
      .put(`${apiURL}/${addedCategory.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Category' })
      .expect(403)
  })
})
