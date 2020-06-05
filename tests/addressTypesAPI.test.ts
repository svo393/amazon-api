import supertest from 'supertest'
import app from '../src/app'
import { AddressType } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { addressTypesInDB, createOneAddressType, loginAs, newAddressType, populateUsers, purge } from './testHelper'

const api = supertest(app)

const apiURL = apiURLs.addressTypes

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('AddressType adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root')
    const addressTypesAtStart = await addressTypesInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newAddressType())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const addressTypesAtEnd = await addressTypesInDB()
    expect(addressTypesAtEnd).toHaveLength(addressTypesAtStart.length + 1)
  })

  test('403 if not root ar admin', async () => {
    const { token } = await loginAs('customer')

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newAddressType())
      .expect(403)
  })
})

describe('AddressTypes fetching', () => {
  test('200 addressTypes', async () => {
    const { body }: { body: AddressType[] } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 addressType', async () => {
    const { addedAddressType } = await createOneAddressType('root')

    const { body } = await api
      .get(`${apiURL}/${addedAddressType.addressTypeName}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('AddressType updating', () => {
  test('200 if admin or root', async () => {
    const { addedAddressType, token } = await createOneAddressType('admin')

    const { body } = await api
      .put(`${apiURL}/${addedAddressType.addressTypeName}`)
      .set('Cookie', `token=${token}`)
      .send({ addressTypeName: `Updated AddressType ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.addressTypeName).toContain('Updated AddressType')
  })

  test('403 if not admin or root', async () => {
    const { addedAddressType } = await createOneAddressType('root')
    const { token } = await loginAs('customer')

    await api
      .put(`${apiURL}/${addedAddressType.addressTypeName}`)
      .set('Cookie', `token=${token}`)
      .send({ addressTypeName: `Updated AddressType ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
