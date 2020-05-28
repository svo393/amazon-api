import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { answerCommentsInDB, createOneAnswer, createOneAnswerComment, loginAs, newAnswerComment, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.answerComments

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('AnswerComment adding', () => {
  test('201', async () => {
    const { token } = await loginAs('customer', api)
    const { answerID } = await createOneAnswer()

    await api
      .post(`${apiURLs.answers}/comments`)
      .set('Cookie', `token=${token}`)
      .send(newAnswerComment(answerID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const answerCommentsAtEnd = await answerCommentsInDB()
    expect(answerCommentsAtEnd).toHaveLength(1)
  })
})

describe('AnswerComment fetching', () => {
  test('200 comments by answer', async () => {
    const { answerID } = await createOneAnswer()

    const { body } = await api
      .get(`${apiURLs.answers}/${answerID}/comments`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 answerComment', async () => {
    const { answerCommentID } = await createOneAnswerComment()

    const { body } = await api
      .get(`${apiURL}/${answerCommentID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('AnswerComment updating', () => {
  test('200 if creator', async () => {
    const { answerCommentID, token } = await createOneAnswerComment()

    const { body } = await api
      .put(`${apiURL}/${answerCommentID}`)
      .set('Cookie', `token=${token}`)
      .send({ content: 'Updated AnswerComment' })
      .expect(200)

    expect(body.content).toBe('Updated AnswerComment')
  })

  test('403 if not creator', async () => {
    const { answerCommentID } = await createOneAnswerComment()
    const { token } = await loginAs('admin', api)

    await api
      .put(`${apiURL}/${answerCommentID}`)
      .set('Cookie', `token=${token}`)
      .send({ title: 'Updated answerComment' })
      .expect(403)
  })
})

describe('AnswerComments deleting', () => {
  test('204 if same user', async () => {
    const { answerCommentID, token } = await createOneAnswerComment()

    await api
      .delete(`${apiURL}/${answerCommentID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })

  test('403 if another user', async () => {
    const { answerCommentID } = await createOneAnswerComment()
    const { token } = await loginAs('admin', api)

    await api
      .delete(`${apiURL}/${answerCommentID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
