import path from 'path'
import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneReview, createOneReviewComment, loginAs, newReviewComment, populateUsers, purge, reviewCommentsInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.reviewComments

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('ReviewComment adding', () => {
  test('201', async () => {
    const { token } = await loginAs('customer')
    const { reviewID } = await createOneReview()

    await api
      .post(`${apiURLs.reviews}/comments`)
      .set('Cookie', `token=${token}`)
      .send(newReviewComment(reviewID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const reviewCommentsAtEnd = await reviewCommentsInDB()
    expect(reviewCommentsAtEnd).toHaveLength(1)
  })

  test('204 upload file', async () => {
    const { reviewCommentID, reviewID } = await createOneReviewComment()
    const { token } = await loginAs('customer')

    await api
      .post(`${apiURLs.reviews}/${reviewID}/comments/${reviewCommentID}/upload`)
      .set('Cookie', `token=${token}`)
      .attach('reviewCommentMedia', path.join(__dirname, 'test-image.png'))
      .attach('reviewCommentMedia', path.join(__dirname, 'test-image2.png'))
      .expect(204)
  })
})

describe('ReviewComment fetching', () => {
  test('200 comments by review', async () => {
    const { reviewID } = await createOneReview()

    const { body } = await api
      .get(`${apiURLs.reviews}/${reviewID}/comments`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 reviewComment', async () => {
    const { reviewCommentID } = await createOneReviewComment()

    const { body } = await api
      .get(`${apiURL}/${reviewCommentID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('ReviewComment updating', () => {
  test('200 if creator', async () => {
    const { reviewCommentID, token } = await createOneReviewComment()

    const { body } = await api
      .put(`${apiURL}/${reviewCommentID}`)
      .set('Cookie', `token=${token}`)
      .send({ content: 'Updated ReviewComment' })
      .expect(200)

    expect(body.content).toBe('Updated ReviewComment')
  })
})

describe('ReviewComments deleting', () => {
  test('204 if same user', async () => {
    const { reviewCommentID, token } = await createOneReviewComment()

    await api
      .delete(`${apiURL}/${reviewCommentID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })

  test('403 if another user', async () => {
    const { reviewCommentID } = await createOneReviewComment()
    const { token } = await loginAs('admin')

    await api
      .delete(`${apiURL}/${reviewCommentID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
