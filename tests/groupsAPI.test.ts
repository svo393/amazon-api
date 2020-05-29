import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneGroup, loginAs, newGroup, populateUsers, purge, groupsInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.groups

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Group adding', () => {
  test('201', async () => {
    const { token } = await loginAs('admin', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newGroup())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const groupsAtEnd = await groupsInDB()
    expect(groupsAtEnd).toHaveLength(1)
  })

  test('403 if not admin or root', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newGroup())
      .expect(403)
  })
})

describe('Group fetching', () => {
  test('200 groups', async () => {
    await createOneGroup('admin')

    const { body } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 group', async () => {
    const { addedGroup } = await createOneGroup('admin')

    const { body } = await api
      .get(`${apiURL}/${addedGroup.groupID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Group updating', () => {
  test('200 if admin or root', async () => {
    const { addedGroup, token } = await createOneGroup('admin')

    const { body } = await api
      .put(`${apiURL}/${addedGroup.groupID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Group' })
      .expect(200)

    expect(body.name).toBe('Updated Group')
  })

  test('403 if not admin or root', async () => {
    const { addedGroup } = await createOneGroup('admin')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedGroup.groupID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Group' })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
