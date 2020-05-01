import { VendorCreateInput } from '@prisma/client'
import supertest from 'supertest'
import app from '../src/app'
import { vendorsInDB, loginAs, populateUsers } from './testHelper'

const api = supertest(app)
const apiURL = '/api/vendors'

const newVendor = (): VendorCreateInput => ({
  name: `New Vendor ${(new Date().getTime()).toString()}`
})

const createOneVendor = async (role: string): Promise<any> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(newVendor())

  return { addedVendor: body, token }
}

beforeEach(async () => {
  await populateUsers()
})

describe('Vendor adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root', api)

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
    await api
      .post(apiURL)
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
      .get(`${apiURL}/${addedVendor.id}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Vendor updating', () => {
  test('200 if admin or root', async () => {
    const { addedVendor, token } = await createOneVendor('admin')

    const { body } = await api
      .put(`${apiURL}/${addedVendor.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Vendor' })
      .expect(200)

    expect(body.name).toBe('Updated Vendor')
  })

  test('403 if not admin or root', async () => {
    const { addedVendor } = await createOneVendor('admin')
    const { token } = await createOneVendor('customer')

    await api
      .put(`${apiURL}/${addedVendor.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Vendor' })
      .expect(403)
  })
})
