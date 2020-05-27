import supertest from 'supertest'
import app from '../src/app'
import { db } from '../src/utils/db'
import { apiURLs, createOneProduct, loginAs, newRating, populateUsers, purge, ratingsInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.ratings

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Rating adding', () => {
  test('201', async () => {
    const { token } = await loginAs('customer', api)
    const { addedProduct } = await createOneProduct('admin')

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newRating(addedProduct.productID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const ratingsAtEnd = await ratingsInDB()
    expect(ratingsAtEnd).toHaveLength(1)
  })
})

// describe('Rating fetching', () => {
//   test('200 ratings', async () => {
//     await createOneRating()

//     const { body } = await api
//       .get(apiURL)
//       .expect(200)

//     expect(body).toBeDefined()
//   })

//   test('200 rating', async () => {
//     const { addedRating } = await createOneRating('admin')

//     const { body } = await api
//       .get(`${apiURL}/${addedRating.ratingID}`)
//       .expect(200)

//     expect(body).toBeDefined()
//   })
// })

// describe('Rating updating', () => {
//   test('200 if admin or root', async () => {
//     const { addedRating, token } = await createOneRating('admin')

//     const { body } = await api
//       .put(`${apiURL}/${addedRating.ratingID}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Updated Rating' })
//       .expect(200)

//     expect(body.name).toBe('Updated Rating')
//   })

//   test('403 if not admin or root', async () => {
//     const { addedRating } = await createOneRating('admin')
//     const { token } = await loginAs('customer', api)

//     await api
//       .put(`${apiURL}/${addedRating.ratingID}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Updated Rating' })
//       .expect(403)
//   })
// })

afterAll(async () => await db.destroy())
