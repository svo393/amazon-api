import path from 'path'
import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneProduct, createOneReview, loginAs, newReview, populateUsers, purge, reviewsInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.reviews

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Review adding', () => {
  test('201', async () => {
    const { token } = await loginAs('customer')
    const { addedProduct } = await createOneProduct('admin')

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newReview(addedProduct.groupID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const reviewsAtEnd = await reviewsInDB()
    expect(reviewsAtEnd).toHaveLength(1)
  })

  test('204 upload file', async () => {
    const { reviewID } = await createOneReview()
    const { token } = await loginAs('customer')

    await api
      .post(`${apiURL}/${reviewID}/upload`)
      .set('Cookie', `token=${token}`)
      .attach('reviewMedia', path.join(__dirname, 'test-image.png'))
      .attach('reviewMedia', path.join(__dirname, 'test-image2.png'))
      .expect(204)
  })
})

describe('Review fetching', () => {
  test('200 reviews by user', async () => {
    const { userID } = await createOneReview()

    const { body } = await api
      .get(`${apiURLs.users}/${userID}/reviews`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 reviews by group', async () => {
    const { groupID } = await createOneReview()

    const { body } = await api
      .get(`${apiURLs.groups}/${groupID}/reviews`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 review', async () => {
    const { reviewID } = await createOneReview()

    const { body } = await api
      .get(`${apiURL}/${reviewID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Review updating', () => {
  test('200 if creator', async () => {
    const { reviewID, token } = await createOneReview()

    const { body } = await api
      .put(`${apiURL}/${reviewID}`)
      .set('Cookie', `token=${token}`)
      .send({ title: 'Updated Review' })
      .expect(200)

    expect(body.title).toBe('Updated Review')
  })
})

describe('Reviews deleting', () => {
  test('204 if same user and 404 fetching', async () => {
    const { reviewID, token } = await createOneReview()

    await api
      .delete(`${apiURL}/${reviewID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)

    await api
      .get(`${apiURL}/${reviewID}`)
      .expect(404)
  })

  test('403 if another user', async () => {
    const { reviewID } = await createOneReview()
    const { token } = await loginAs('admin')

    await api
      .delete(`${apiURL}/${reviewID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
