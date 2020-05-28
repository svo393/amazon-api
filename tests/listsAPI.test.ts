import supertest from 'supertest'
import app from '../src/app'
import { List } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneList, listsInDB, loginAs, newList, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.lists

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('List adding', () => {
  test('201', async () => {
    const { token } = await loginAs('customer', api)

    const listsAtStart = await listsInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newList())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const listsAtEnd = await listsInDB()
    expect(listsAtEnd).toHaveLength(listsAtStart.length + 1)
  })
})

describe('Lists fetching', () => {
  test('200 lists by user', async () => {
    const { userID, token } = await createOneList()

    const { body }: { body: List[] } = await api
      .get(`${apiURLs.users}/${userID}/lists`)
      .set('Cookie', `token=${token}`)
      .expect(200)
    expect(body).toBeDefined()
  })

  test('200 list if creator', async () => {
    const { listID, token } = await createOneList()

    const { body } = await api
      .get(`${apiURL}/${listID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('List updating', () => {
  test('200 if creator', async () => {
    const { listID, token } = await createOneList()

    const { body } = await api
      .put(`${apiURL}/${listID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated List' })
      .expect(200)

    expect(body.name).toBe('Updated List')
  })
})

describe('Lists deleting', () => {
  test('204 if same user', async () => {
    const { listID, token } = await createOneList()

    await api
      .delete(`${apiURL}/${listID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })
})

afterAll(async () => await db.destroy())
