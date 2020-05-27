import supertest from 'supertest'
import app from '../src/app'
import { AddressType, AddressTypeInput } from '../src/types'
import { db } from '../src/utils/db'
import { addressTypesInDB, loginAs, populateUsers, purge } from './testHelper'

const api = supertest(app)

export const apiURL = '/api/address-types'

const newAddressType = (): AddressTypeInput => ({
  name: `New AddressType ${(new Date().getTime()).toString()}`
})

export const createOneAddressType = async (addressType: string): Promise<{ addedAddressType: AddressType; token: string}> => {
  const { token } = await loginAs(addressType, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(newAddressType())

  return { addedAddressType: body, token }
}

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('AddressType adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root', api)
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
    const { token } = await loginAs('customer', api)

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
      .get(`${apiURL}/${addedAddressType.addressTypeID}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('AddressType updating', () => {
  test('200 if admin or root', async () => {
    const { addedAddressType, token } = await createOneAddressType('admin')

    const { body } = await api
      .put(`${apiURL}/${addedAddressType.addressTypeID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated AddressType ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.name).toContain('Updated AddressType')
  })

  test('403 if not admin or root', async () => {
    const { addedAddressType } = await createOneAddressType('root')
    const { token } = await loginAs('customer', api)

    await api
      .put(`${apiURL}/${addedAddressType.addressTypeID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated AddressType ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
