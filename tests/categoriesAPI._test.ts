import { CategoryCreateInput } from '@prisma/client'
import supertest from 'supertest'
import app from '../src/app'
import { loginAs, populateUsers, categoriesInDB } from './testHelper'

const api = supertest(app)

const newCategory = (): CategoryCreateInput => ({
  name: `New Category ${(new Date().getTime()).toString()}`
})

const createOneCategory = async (role = 'root'): Promise<any> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post('/api/categories')
    .set('Cookie', `token=${token}`)
    .send(newCategory())

  return { addedCategory: body, token }
}

beforeEach(async () => {
  await populateUsers()
})

describe('Category adding', () => {
  test('200', async () => {
    const { token, id } = await loginAs('admin', api)

    await api
      .post('/api/categories')
      .set('Cookie', `token=${token}`)
      .send(newCategory())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const categorysAtEnd = await categoriesInDB()
    const longDescriptions = categorysAtEnd.map((i) => i.longDescription)
    expect(longDescriptions).toContain('Very Cool Category')
  })

  test('400 if no price', async () => {
    const { token, id } = await loginAs('root', api)

    const newCategoryWithoutPrice = { ...newCategory(id), price: undefined }

    await api
      .post('/api/categorys')
      .set('Cookie', `token=${token}`)
      .send(newCategoryWithoutPrice)
      .expect(400)
  })
})

// describe('Category fetching', () => {
//   test('200', async () => {
//     await createOneCategory()

//     const { body } = await api
//       .get('/api/categorys')
//       .expect(200)

//     expect(body).toBeDefined()
//   })

//   test('public category if not root', async () => {
//     const { addedCategory } = await createOneCategory()

//     const { body } = await api
//       .get(`/api/categorys/${addedCategory.id}`)
//       .expect(200)

//     expect(Object.keys(body)).toHaveLength(15)
//   })

//   test('full tiem if root', async () => {
//     const { addedCategory, token } = await createOneCategory()

//     const { body } = await api
//       .get(`/api/categorys/${addedCategory.id}`)
//       .set('Cookie', `token=${token}`)
//       .expect(200)

//     expect(Object.keys(body)).toHaveLength(18)
//   })
// })

// describe('Category updating', () => {
//   test('200 if own category', async () => {
//     const { addedCategory, token } = await createOneCategory()

//     const { body } = await api
//       .put(`/api/categorys/${addedCategory.id}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Updated Category' })
//       .expect(200)

//     expect(body.name).toBe('Updated Category')
//   })

//   test('403 if another user\'s category', async () => {
//     const { token } = await createOneCategory('admin')
//     const { addedCategory: anotherAddedCategory } = await createOneCategory()

//     await api
//       .put(`/api/categorys/${anotherAddedCategory.id}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Updated Category' })
//       .expect(403)
//   })
// })
