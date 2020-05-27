import supertest from 'supertest'
import app from '../src/app'
import { Follower } from '../src/types'
import { db } from '../src/utils/db'
import { apiURLs, createOneFollower, followersInDB, getUserByEmail, loginAs, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.followers

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Follower adding', () => {
  test('201', async () => {
    const user1 = await getUserByEmail('admin@example.com')
    const { userID: user2ID, token } = await loginAs('customer', api)

    const followersAtStart = await followersInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send({ userID: user2ID, follows: user1.userID })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const followersAtEnd = await followersInDB()
    expect(followersAtEnd).toHaveLength(followersAtStart.length + 1)
  })
})

describe('Followers fetching', () => {
  test('200 followers', async () => {
    const { follows } = await createOneFollower()

    const { body }: { body: Follower[] } = await api
      .get(`${apiURL}?follows=${follows}`)
      .expect(200)
    expect(body).toBeDefined()
  })
})

describe('Followers deleting', () => {
  test('204 if same user', async () => {
    const { userID, follows, token } = await createOneFollower()

    await api
      .delete(`${apiURL}/${userID}/${follows}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })

  test('403 if another user', async () => {
    const { userID, follows } = await createOneFollower()
    const { token } = await loginAs('admin', api)

    await api
      .delete(`${apiURL}/${userID}/${follows}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
