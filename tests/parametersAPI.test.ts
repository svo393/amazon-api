import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneParameter, loginAs, newParameter, populateUsers, purge, parametersInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.parameters

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Parameter adding', () => {
  test('201', async () => {
    const { token } = await loginAs('admin', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newParameter())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const parametersAtEnd = await parametersInDB()
    expect(parametersAtEnd).toHaveLength(1)
  })

  test('403 if not admin or root', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newParameter())
      .expect(403)
  })
})

describe('Parameter fetching', () => {
  test('200 parameters', async () => {
    await createOneParameter('admin')

    const { body } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 parameter', async () => {
    const { addedParameter } = await createOneParameter('admin')

    const { body } = await api
      .get(`${apiURL}/${addedParameter.parameterID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Parameter updating', () => {
  test('200 if admin or root', async () => {
    const { addedParameter, token } = await createOneParameter('admin')

    const { body } = await api
      .put(`${apiURL}/${addedParameter.parameterID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Parameter' })
      .expect(200)

    expect(body.name).toBe('Updated Parameter')
  })

  test('403 if not admin or root', async () => {
    const { addedParameter } = await createOneParameter('admin')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedParameter.parameterID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Parameter' })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
