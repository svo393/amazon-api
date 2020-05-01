import supertest from 'supertest'
import app from '../src/app'
import { categoriesInDB, loginAs, populateUsers } from './testHelper'

const api = supertest(app)
const apiURL = '/api/categories'

const newCategory = {
  name: `New Category ${(new Date().getTime()).toString()}`
}

const createOneCategory = async (role: string): Promise<any> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(newCategory)

  return { addedCategory: body, token }
}

beforeEach(async () => {
  await populateUsers()
})

describe('Category adding', () => {
  test.only('200', async () => {
    const { token } = await loginAs('root', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newCategory)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const categoriesAtEnd = await categoriesInDB()
    const longDescriptions = categoriesAtEnd.map((c) => c.name)
    expect(longDescriptions).toContain('Very Cool Category')
  })

  // test('403 if not admin or root', async () => {
  //   const { addedItem } = await createOneItem()

  //   await api
  //     .post(`${apiURL}/${addedItem.id}/upload`)
  //     .attach('itemMedia', path.join(__dirname, 'test-image.png'))
  //     .attach('itemMedia', path.join(__dirname, 'test-image2.png'))
  //     .expect(403)
  // })
})

// describe('Item fetching', () => {
//   test('200', async () => {
//     await createOneItem()

//     const { body } = await api
//       .get(apiURL)
//       .expect(200)

//     expect(body).toBeDefined()
//   })
// })

// describe('Item updating', () => {
//   test('200 if admin or root', async () => {
//     const { addedItem, token } = await createOneItem()

//     const { body } = await api
//       .put(`${apiURL}/${addedItem.id}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Updated Item' })
//       .expect(200)

//     expect(body.name).toBe('Updated Item')
//   })

//   test('403 if not admin or root', async () => {
//     const { token } = await createOneItem('admin')
//     const { addedItem: anotherAddedItem } = await createOneItem()

//     await api
//       .put(`${apiURL}/${anotherAddedItem.id}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Updated Item' })
//       .expect(403)
//   })
// })
