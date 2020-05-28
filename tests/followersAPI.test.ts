import supertest from 'supertest'
import app from '../src/app'
import { Follower } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneFollower, followersInDB, loginAs, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.users

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Follower adding', () => {
  test('201', async () => {
    const { token, userID } = await loginAs('root', api)
    const { userID: follows } = await loginAs('customer', api)

    const followersAtStart = await followersInDB()

    await api
      .post(`${apiURLs.users}/${userID}/follows/${follows}`)
      .set('Cookie', `token=${token}`)
      .send({ userID, follows })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const followersAtEnd = await followersInDB()
    expect(followersAtEnd).toHaveLength(followersAtStart.length + 1)
  })
})

describe('Followers fetching', () => {
  test('200 followers by user', async () => {
    const { follows } = await createOneFollower()

    const { body }: { body: Follower[] } = await api
      .get(`${apiURL}/${follows}/followers`)
      .expect(200)
    expect(body).toBeDefined()
  })

  test('200 followed by user', async () => {
    const { userID } = await createOneFollower()

    const { body }: { body: Follower[] } = await api
      .get(`${apiURL}/${userID}/follows`)
      .expect(200)
    expect(body).toBeDefined()
  })
})

describe('Followers deleting', () => {
  test('204 if same user', async () => {
    const { userID, follows, token } = await createOneFollower()

    await api
      .delete(`${apiURL}/${userID}/follows/${follows}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })

  test('403 if another user', async () => {
    const { userID, follows } = await createOneFollower()
    const { token } = await loginAs('admin', api)

    await api
      .delete(`${apiURL}/${userID}/follows/${follows}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
