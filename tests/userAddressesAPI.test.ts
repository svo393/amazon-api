import supertest from 'supertest'
import app from '../src/app'
import { UserAddress } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneAddress, createOneUserAddress, loginAs, populateUsers, purge, userAddressesInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.userAddresses

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('UserAddress adding', () => {
  test('201', async () => {
    const { addedAddress } = await createOneAddress('admin')
    const { userID, token } = await loginAs('customer')

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

describe('UserAddress updating', () => {
  test('200 if same user', async () => {
    const { userID, addressID, token } = await createOneUserAddress()

    const { body }: { body: UserAddress } = await api
      .put(`${apiURLs.users}/${userID}/addresses/${addressID}`)
      .set('Cookie', `token=${token}`)
      .send({ isDefault: true })
      .expect(200)

    expect(body.isDefault).toBe(true)
  })
})

describe('UserAddress deleting', () => {
  test('204 if same user', async () => {
    const { userID, addressID, token } = await createOneUserAddress()

    await api
      .delete(`${apiURLs.users}/${userID}/addresses/${addressID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })

  test('403 if another user', async () => {
    const { userID, addressID } = await createOneUserAddress()
    const { token } = await loginAs('admin')

    await api
      .delete(`${apiURLs.users}/${userID}/addresses/${addressID}`)
      .set('Cookie', `token=${token}`)
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
