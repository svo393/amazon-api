import supertest from 'supertest'
import app from '../src/app'
import { db } from '../src/utils/db'
import { categoriesInDB, loginAs, populateUsers, purge } from './testHelper'
import { CategoryCreateInput, Category } from '../src/types'

const api = supertest(app)
const apiURL = '/api/categories'

const newCategory = (name?: string, parentCategoryID?: number): CategoryCreateInput => ({
  name: name ?? `New Category ${Date.now().toString()}`,
  parentCategoryID
})

export const createOneCategory = async (role: string, name?: string, parentCategoryID?: number): Promise<{ addedCategory: Category; token: string}> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(newCategory(name, parentCategoryID))

  return { addedCategory: body, token }
}

beforeEach(async () => {
  await purge()
  await populateUsers(api)
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
