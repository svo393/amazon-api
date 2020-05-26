
import supertest from 'supertest'
import app from '../src/app'
import { Address, AddressCreateInput } from '../src/types'
import { db } from '../src/utils/db'
import { createOneAddressType } from './addressTypesAPI.test'
import { addressesInDB, loginAs, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = '/api/addresses'

const newAddress = async (): Promise<AddressCreateInput> => {
  const { addedAddressType } = await createOneAddressType('root')
  return {
    addr: `New Address ${(new Date().getTime()).toString()}`,
    addressTypeID: addedAddressType.addressTypeID,
    isDefault: true
  }
}

export const createOneAddress = async (role: string): Promise<{ addedAddress: Address; token: string}> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(await newAddress())

  return { addedAddress: body, token }
}

beforeEach(async () => {
  await purge()
  await populateUsers(api)
})

describe('Address adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root', api)
    const addressesAtStart = await addressesInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(await newAddress())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const addressesAtEnd = await addressesInDB()
    expect(addressesAtEnd).toHaveLength(addressesAtStart.length + 1)
  })
})

describe('Addresses fetching', () => {
  test('200 addresses', async () => {
    const { addedAddress } = await createOneAddress('root')

    const { body }: { body: Address[] } = await api
      .get(`${apiURL}?addressTypeID=${addedAddress.addressTypeID}`)
      .expect(200)
    expect(body).toBeDefined()
  })

  test('200 address', async () => {
    const { addedAddress, token } = await createOneAddress('root')

    const { body } = await api
      .get(`${apiURL}/${addedAddress.addressID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

afterAll(async () => await db.destroy())
