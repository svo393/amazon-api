import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { loginAs, populateUsers, purge, usersInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.users

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('User authorization', () => {
  test('201 signup', async () => {
    const newUser = {
      email: 'customer2@example.com',
      password: '12345678'
    }

    await api
      .post(apiURLs.auth)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDB()
    const emails = usersAtEnd.map((u) => u.email)
    expect(emails).toContain('customer2@example.com')
  })

  test('400 signup if no email', async () => {
    const newUser = {
      password: '12345678'
    }

    await api
      .post(apiURLs.auth)
      .send(newUser)
      .expect(400)
  })

  test('204 logout with sessionID deletion', async () => {
    const { sessionID } = await loginAs('customer')

    const resLogout = await api
      .post(`${apiURLs.auth}/logout`)
      .set('Cookie', `sessionID=${sessionID}`)
      .expect(200)

    expect(resLogout.body).toBe(null)
  })

  test('401 login if invalid password', async () => {
    const user = {
      email: 'customer@example.com',
      password: '123456789',
      remember: true
    }

    await api
      .post(`${apiURLs.auth}/login`)
      .send(user)
      .expect(401)
  })
})

describe('User fetching', () => {
  test.only('403 users if not root or admin', async () => {
    const { sessionID } = await loginAs('customer')

    await api
      .get(apiURL)
      .set('Cookie', `sessionID=${sessionID}`)
      .expect(403)
  })

  test('200 users if admin', async () => {
    const { sessionID } = await loginAs('admin')

    await api
      .get(apiURL)
      .set('Cookie', `sessionID=${sessionID}`)
      .expect(200)
  })

  test('public user if not root or admin', async () => {
    const { userID } = await loginAs('admin')

    const { body } = await api
      .get(`${apiURL}/${userID}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(7)
  })

  test('full user if admin', async () => {
    const { sessionID } = await loginAs('admin')
    const { userID } = await loginAs('customer')

    const { body } = await api
      .get(`${apiURL}/${userID}`)
      .set('Cookie', `sessionID=${sessionID}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(10)
  })

  test('full user if own profile', async () => {
    const { sessionID } = await loginAs('customer')

    const { body } = await api
      .get(`${apiURL}/me`)
      .set('Cookie', `sessionID=${sessionID}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(13)
  })
})

describe('User updating', () => {
  test('200 if own profile', async () => {
    const { sessionID, userID } = await loginAs('customer')

    const { body } = await api
      .put(`${apiURL}/${userID}`)
      .set('Cookie', `sessionID=${sessionID}`)
      .send({ name: 'Jack' })
      .expect(200)

    expect(Object.keys(body)).toHaveLength(6)
    expect(body.name).toBe('Jack')
  })

  test('403 if another user\'s profile', async () => {
    const { sessionID } = await loginAs('customer')
    const { userID } = await loginAs('admin')

    await api
      .put(`${apiURL}/${userID}`)
      .set('Cookie', `sessionID=${sessionID}`)
      .send({ name: 'Jack' })
      .expect(403)
  })

  test('200 if root', async () => {
    const { sessionID } = await loginAs('root')
    const { userID } = await loginAs('admin')

    await api
      .put(`${apiURL}/${userID}`)
      .set('Cookie', `sessionID=${sessionID}`)
      .send({ name: 'Jack' })
      .expect(200)
  })

  test('204 password reset request', async () => {
    await api
      .post(`${apiURLs.auth}/request-password-reset`)
      .send({ email: 'customer@example.com' })
      .expect(204)
  })
})

describe('User deleting', () => {
  test('204 if same user', async () => {
    const { sessionID, userID } = await loginAs('customer')

    const usersAtStart = await usersInDB()

    await api
      .delete(`${apiURLs.auth}/${userID}`)
      .set('Cookie', `sessionID=${sessionID}`)
      .expect(204)

    const usersAtEnd = await usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length - 1)
  })

  test('403 if not same user', async () => {
    const { userID } = await loginAs('admin')
    const { sessionID } = await loginAs('customer')

    await api
      .delete(`${apiURLs.auth}/${userID}`)
      .set('Cookie', `sessionID=${sessionID}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
