import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { answersInDB, createOneAnswer, createOneQuestion, loginAs, newAnswer, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.answers

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Answer adding', () => {
  test('201', async () => {
    const { token } = await loginAs('customer', api)
    const { questionID } = await createOneQuestion()

    await api
      .post(`${apiURLs.questions}/answers`)
      .set('Cookie', `token=${token}`)
      .send(newAnswer(questionID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const answersAtEnd = await answersInDB()
    expect(answersAtEnd).toHaveLength(1)
  })
})

describe('Answer fetching', () => {
  test('200 answers by question', async () => {
    const { questionID } = await createOneAnswer()

    const { body } = await api
      .get(`${apiURLs.questions}/${questionID}/answers`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 answer', async () => {
    const { answerID } = await createOneAnswer()

    const { body } = await api
      .get(`${apiURL}/${answerID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Answer updating', () => {
  test('200 if creator', async () => {
    const { answerID, token } = await createOneAnswer()

    const { body } = await api
      .put(`${apiURL}/${answerID}`)
      .set('Cookie', `token=${token}`)
      .send({ content: 'Updated Answer' })
      .expect(200)

    expect(body.content).toBe('Updated Answer')
  })

  test('403 if not creator', async () => {
    const { answerID } = await createOneAnswer()
    const { token } = await loginAs('admin', api)

    await api
      .put(`${apiURL}/${answerID}`)
      .set('Cookie', `token=${token}`)
      .send({ content: 'Updated Answer' })
      .expect(403)
  })
})

describe('Answers deleting', () => {
  test('204 if same user and 404 fetching', async () => {
    const { answerID, token } = await createOneAnswer()

    await api
      .delete(`${apiURL}/${answerID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)

    await api
      .get(`${apiURL}/${answerID}`)
      .expect(404)
  })

  test('403 if another user', async () => {
    const { answerID } = await createOneAnswer()
    const { token } = await loginAs('admin', api)

    await api
      .delete(`${apiURL}/${answerID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
