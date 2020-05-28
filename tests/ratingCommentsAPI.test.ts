import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneRating, createOneRatingComment, loginAs, newRatingComment, populateUsers, purge, ratingCommentsInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.ratingComments

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('RatingComment adding', () => {
  test('201', async () => {
    const { token } = await loginAs('customer', api)
    const { ratingID } = await createOneRating()

    await api
      .post(`${apiURLs.ratings}/comments`)
      .set('Cookie', `token=${token}`)
      .send(newRatingComment(ratingID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const ratingCommentsAtEnd = await ratingCommentsInDB()
    expect(ratingCommentsAtEnd).toHaveLength(1)
  })
})

describe('RatingComment fetching', () => {
  test('200 comments by rating', async () => {
    const { ratingID } = await createOneRating()

    const { body } = await api
      .get(`${apiURLs.ratings}/${ratingID}/comments`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 ratingComment', async () => {
    const { ratingCommentID } = await createOneRatingComment()

    const { body } = await api
      .get(`${apiURL}/${ratingCommentID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('RatingComment updating', () => {
  test('200 if creator', async () => {
    const { ratingCommentID, token } = await createOneRatingComment()

    const { body } = await api
      .put(`${apiURL}/${ratingCommentID}`)
      .set('Cookie', `token=${token}`)
      .send({ content: 'Updated RatingComment' })
      .expect(200)

    expect(body.content).toBe('Updated RatingComment')
  })

  test('403 if not creator', async () => {
    const { ratingCommentID } = await createOneRatingComment()
    const { token } = await loginAs('admin', api)

    await api
      .put(`${apiURL}/${ratingCommentID}`)
      .set('Cookie', `token=${token}`)
      .send({ title: 'Updated ratingComment' })
      .expect(403)
  })
})

// describe('RatingComments deleting', () => {
//   test('204 if same user', async () => {
//     const { ratingCommentID, token } = await createOneRatingComment()

//     await api
//       .delete(`${apiURL}/${ratingCommentID}`)
//       .set('Cookie', `token=${token}`)
//       .expect(204)
//   })

//   test('403 if another user', async () => {
//     const { ratingCommentID } = await createOneRatingComment()
//     const { token } = await loginAs('admin', api)

//     await api
//       .delete(`${apiURL}/${ratingCommentID}`)
//       .set('Cookie', `token=${token}`)
//       .expect(403)
//   })
// })

afterAll(async () => await db.destroy())
