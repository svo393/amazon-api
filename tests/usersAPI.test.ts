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
      .post(apiURL)
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
      .post(apiURL)
      .send(newUser)
      .expect(400)
  })

  test('204 logout with token deletion', async () => {
    const { token } = await loginAs('customer')

    const resLogout = await api
      .post(`${apiURL}/logout`)
      .set('Cookie', `token=${token}`)
      .expect(204)

    expect(resLogout.header['set-cookie'][0].split('; ')[0].slice(6)).toHaveLength(0)
  })

  test('401 login if invalid password', async () => {
    const user = {
      email: 'customer@example.com',
      password: '123456789',
      remember: true
    }

    await api
      .post(`${apiURL}/login`)
      .send(user)
      .expect(401)
  })
})

describe('User fetching', () => {
  test('403 users if not root or admin', async () => {
    const { token } = await loginAs('customer')

    await api
      .get(apiURL)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })

  test('200 users if admin', async () => {
    const { token } = await loginAs('admin')

    await api
      .get(apiURL)
      .set('Cookie', `token=${token}`)
      .expect(200)
  })

  test('public user if not root or admin', async () => {
    const { userID } = await loginAs('admin')

    const { body } = await api
      .get(`${apiURL}/${userID}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(9)
  })

  test('full user if admin', async () => {
    const { token } = await loginAs('admin')
    const { userID } = await loginAs('customer')

    const { body } = await api
      .get(`${apiURL}/${userID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(13)
  })

  test('full user if own profile', async () => {
    const { token } = await loginAs('customer')

    const { body } = await api
      .get(`${apiURL}/me`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(13)
  })
})

describe('User updating', () => {
  test('200 if own profile', async () => {
    const { token, userID } = await loginAs('customer')

    const { body } = await api
      .put(`${apiURL}/${userID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Jack' })
      .expect(200)

    expect(Object.keys(body)).toHaveLength(3)
    expect(body.name).toBe('Jack')
  })

  test('403 if another user\'s profile', async () => {
    const { token } = await loginAs('customer')
    const { userID } = await loginAs('admin')

    await api
      .put(`${apiURL}/${userID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Jack' })
      .expect(403)
  })

  test('200 if root', async () => {
    const { token } = await loginAs('root')
    const { userID } = await loginAs('admin')

    await api
      .put(`${apiURL}/${userID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Jack' })
      .expect(200)
  })

  test('204 password reset request', async () => {
    await api
      .post(`${apiURL}/request-password-reset`)
      .send({ email: 'customer@example.com' })
      .expect(204)
  })
})

describe('User deleting', () => {
  test('204 if same user', async () => {
    const { token, userID } = await loginAs('customer')

    const usersAtStart = await usersInDB()

    await api
      .delete(`${apiURL}/${userID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)

    const usersAtEnd = await usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length - 1)
  })

  test('403 if not same user', async () => {
    const { userID } = await loginAs('admin')
    const { token } = await loginAs('customer')

    await api
      .delete(`${apiURL}/${userID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
