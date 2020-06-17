import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.feed

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Feed fetching', () => {
  test('200', async () => {
    const { body } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })
})

afterAll(async () => await db.destroy())
