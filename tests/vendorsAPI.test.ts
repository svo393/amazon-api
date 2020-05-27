import supertest from 'supertest'
import app from '../src/app'
import { db } from '../src/utils/db'
import { apiURLs, createOneVendor, loginAs, newVendor, populateUsers, purge, vendorsInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.vendors

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Vendor adding', () => {
  test('201', async () => {
    const { token } = await loginAs('admin', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newVendor())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const vendorsAtEnd = await vendorsInDB()
    expect(vendorsAtEnd).toHaveLength(1)
  })

  test('403 if not admin or root', async () => {
    const { token } = await loginAs('customer', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newVendor())
      .expect(403)
  })
})

describe('Vendor fetching', () => {
  test('200 vendors', async () => {
    await createOneVendor('admin')

    const { body } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 vendor', async () => {
    const { addedVendor } = await createOneVendor('admin')

    const { body } = await api
      .get(`${apiURL}/${addedVendor.vendorID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Vendor updating', () => {
  test('200 if admin or root', async () => {
    const { addedVendor, token } = await createOneVendor('admin')

    const { body } = await api
      .put(`${apiURL}/${addedVendor.vendorID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Vendor' })
      .expect(200)

    expect(body.name).toBe('Updated Vendor')
  })

  test('403 if not admin or root', async () => {
    const { addedVendor } = await createOneVendor('admin')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedVendor.vendorID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Vendor' })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
