import supertest from 'supertest'
import app from '../src/app'
import { UserAddress } from '../src/types'
import { db } from '../src/utils/db'
import { apiURLs, createOneAddress, createOneUserAddress, loginAs, populateUsers, purge, userAddressesInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.userAddresses

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('UserAddress adding', () => {
  test('201', async () => {
    const { addedAddress } = await createOneAddress('admin')
    const { userID, token } = await loginAs('customer', api)

    const userAddressesAtStart = await userAddressesInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send({ userID, addressID: addedAddress.addressID })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAddressesAtEnd = await userAddressesInDB()
    expect(userAddressesAtEnd).toHaveLength(userAddressesAtStart.length + 1)
  })
})

describe('UserAddresss fetching', () => {
  test('200 userAddresses', async () => {
    const { userID, token } = await createOneUserAddress()

    const { body }: { body: UserAddress[] } = await api
      .get(`${apiURL}?userID=${userID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('UserAddresss updating', () => {
  test('200 if same user', async () => {
    const { userID, addressID, token } = await createOneUserAddress()

    const { body }: { body: UserAddress } = await api
      .put(`${apiURL}/${addressID}/${userID}`)
      .set('Cookie', `token=${token}`)
      .send({ isDefault: true })
      .expect(200)

    expect(body.isDefault).toBe(true)
  })
})

describe('UserAddresss deleting', () => {
  test('204 if same user', async () => {
    const { userID, addressID, token } = await createOneUserAddress()

    await api
      .delete(`${apiURL}/${addressID}/${userID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })

  test('403 if another user', async () => {
    const { userID, addressID } = await createOneUserAddress()
    const { token } = await loginAs('admin', api)

    await api
      .delete(`${apiURL}/${addressID}/${userID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
