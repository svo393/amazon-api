import supertest from 'supertest'
import app from '../src/app'
import { Address, AddressCreateInput, ShippingMethod } from '../src/types'
import { sensitiveShippingMethods } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { apiURL as atAPIURL, createOneAddressType } from './addressTypesAPI.test'
import { addressesInDB, loginAs, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = '/api/addresses'

const newAddress = async (): Promise<AddressCreateInput> => {
  const { addedAddressType } = await createOneAddressType('root')
  return {
    addr: `New Address ${(new Date().getTime()).toString()}`,
    addressTypeID: addedAddressType.addressTypeID
  }
}

const createOneAddress = async (role: string): Promise<{ addedAddress: Address; token: string}> => {
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
  test.only('200 addresses', async () => {
    const { addedAddress } = await createOneAddress('root')

    const { body }: { body: Address[] } = await api
      .get(`${apiURL}?addressTypeID=${addedAddress.addressTypeID}`)
      .expect(200)

    console.info('body', body)

    expect(body).toBeDefined()
  })

  test('404 addresses whit sensitive shipping methods if not admin or root', async () => {
    const { token } = await loginAs('admin', api)

    const shippingMethods: { body: ShippingMethod[]} = await api
      .get(atAPIURL)
      .set('Cookie', `token=${token}`)

    const shippingMethod = shippingMethods.body.find((sm) =>
      sm.name === sensitiveShippingMethods[0])

    if (!shippingMethod) { throw new Error() }

    await createOneAddress('root')

    await api
      .get(apiURL)
      .send({ shippingMethodID: shippingMethod.shippingMethodID })
      .expect(404)
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

describe('Address updating', () => {
  test('200 if root', async () => {
    const { addedAddress, token } = await createOneAddress('root')

    const { body } = await api
      .put(`${apiURL}/${addedAddress.addressID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated Address ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.name).toContain('Updated Address')
  })

  test('403 if not root', async () => {
    const { addedAddress } = await createOneAddress('root')
    const { token } = await loginAs('admin', api)

    await api
      .put(`${apiURL}/${addedAddress.addressID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated Address ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
