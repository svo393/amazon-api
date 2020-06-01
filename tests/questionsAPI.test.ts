import path from 'path'
import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneProduct, createOneQuestion, loginAs, newQuestion, populateUsers, purge, questionsInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.questions

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Question adding', () => {
  test('201', async () => {
    const { token } = await loginAs('customer')
    const { addedProduct } = await createOneProduct('admin')

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newQuestion(addedProduct.productID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const questionsAtEnd = await questionsInDB()
    expect(questionsAtEnd).toHaveLength(1)
  })

  test('204 upload file', async () => {
    const { questionID } = await createOneQuestion()
    const { token } = await loginAs('customer')

    await api
      .post(`${apiURL}/${questionID}/upload`)
      .set('Cookie', `token=${token}`)
      .attach('questionMedia', path.join(__dirname, 'test-image.png'))
      .attach('questionMedia', path.join(__dirname, 'test-image2.png'))
      .expect(204)
  })
})

describe('Question fetching', () => {
  test('200 questions by user', async () => {
    const { userID } = await createOneQuestion()

    const { body } = await api
      .get(`${apiURLs.users}/${userID}/questions`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 questions by product', async () => {
    const { productID } = await createOneQuestion()

    const { body } = await api
      .get(`${apiURLs.products}/${productID}/questions`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 question', async () => {
    const { questionID } = await createOneQuestion()

    const { body } = await api
      .get(`${apiURL}/${questionID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Question updating', () => {
  test('200 if creator', async () => {
    const { questionID, token } = await createOneQuestion()

    const { body } = await api
      .put(`${apiURL}/${questionID}`)
      .set('Cookie', `token=${token}`)
      .send({ content: 'Updated Question' })
      .expect(200)

    expect(body.content).toBe('Updated Question')
  })

  test('403 if not creator', async () => {
    const { questionID } = await createOneQuestion()
    const { token } = await loginAs('admin')

    await api
      .put(`${apiURL}/${questionID}`)
      .set('Cookie', `token=${token}`)
      .send({ content: 'Updated Question' })
      .expect(403)
  })
})

describe('Questions deleting', () => {
  test('204 if same user and 404 fetching', async () => {
    const { questionID, token } = await createOneQuestion()

    await api
      .delete(`${apiURL}/${questionID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)

    await api
      .get(`${apiURL}/${questionID}`)
      .expect(404)
  })

  test('403 if another user', async () => {
    const { questionID } = await createOneQuestion()
    const { token } = await loginAs('admin')

    await api
      .delete(`${apiURL}/${questionID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
