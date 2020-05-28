import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneProduct, createOneRating, loginAs, newRating, populateUsers, purge, ratingsInDB } from './testHelper'
import { Rating } from '../src/types'

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

describe('Rating fetching', () => {
  test('200 ratings by user', async () => {
    const { userID } = await createOneRating()

    const { body } = await api
      .get(`${apiURLs.users}/${userID}/ratings`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 ratings by product', async () => {
    const { productID } = await createOneRating()

    const { body } = await api
      .get(`${apiURLs.products}/${productID}/ratings`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 rating', async () => {
    const { ratingID } = await createOneRating()

    const { body } = await api
      .get(`${apiURL}/${ratingID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Rating updating', () => {
  test('200 if creator', async () => {
    const { ratingID, token } = await createOneRating()

    const { body } = await api
      .put(`${apiURL}/${ratingID}`)
      .set('Cookie', `token=${token}`)
      .send({ title: 'Updated Rating' })
      .expect(200)

    expect(body.title).toBe('Updated Rating')
  })

  test('403 if not creator', async () => {
    const { ratingID } = await createOneRating()
    const { token } = await loginAs('admin', api)

    await api
      .put(`${apiURL}/${ratingID}`)
      .set('Cookie', `token=${token}`)
      .send({ title: 'Updated Rating' })
      .expect(403)
  })
})

describe('Ratings deleting', () => {
  test('204 if same user and 404 fetching', async () => {
    const { ratingID, token } = await createOneRating()

    await api
      .delete(`${apiURL}/${ratingID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)

    await api
      .get(`${apiURL}/${ratingID}`)
      .expect(404)
  })

  test('403 if another user', async () => {
    const { ratingID } = await createOneRating()
    const { token } = await loginAs('admin', api)

    await api
      .delete(`${apiURL}/${ratingID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
