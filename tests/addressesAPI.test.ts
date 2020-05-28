import supertest from 'supertest'
import app from '../src/app'
import { Address } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { addressesInDB, createOneAddress, loginAs, newAddress, populateUsers, purge } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.addresses

beforeEach(async () => {
  await purge()
  await populateUsers()
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
  test('200 addresses by user', async () => {
    const { userID, token } = await createOneAddress('root')

    const { body }: { body: Address[] } = await api
      .get(`${apiURLs.users}/${userID}/addresses`)
      .set('Cookie', `token=${token}`)
      .expect(200)
    expect(body).toBeDefined()
  })

  test('200 addresses by type', async () => {
    const { addedAddress, token } = await createOneAddress('root')

    const { body }: { body: Address[] } = await api
      .get(`${apiURLs.addressTypes}/${addedAddress.addressTypeID}/addresses`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

afterAll(async () => await db.destroy())
