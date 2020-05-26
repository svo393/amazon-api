import supertest from 'supertest'
import app from '../src/app'
import { UserAddress } from '../src/types'
import { db } from '../src/utils/db'
import { userAddressesInDB, getUserByEmail, loginAs, populateUsers, purge } from './testHelper'
import { createOneAddress } from './addressesAPI.test'

const api = supertest(app)
const apiURL = '/api/user-addresses'

const createOneUserAddress = async (): Promise<UserAddress & { token: string}> => {
  const user1 = await getUserByEmail('admin@example.com')
  const { userID: user2ID, token } = await loginAs('customer', api)

  const { body }: { body: UserAddress } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send({ userID: user2ID, follows: user1.userID })

  return { ...body, token }
}

beforeEach(async () => {
  await purge()
  await populateUsers(api)
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

// describe('UserAddresss fetching', () => {
//   test('200 userAddresses', async () => {
//     const { follows } = await createOneUserAddress()

//     const { body }: { body: UserAddress[] } = await api
//       .get(`${apiURL}?follows=${follows}`)
//       .expect(200)
//     expect(body).toBeDefined()
//   })
// })

// describe('UserAddresss deleting', () => {
//   test('204 if same user', async () => {
//     const { userID, follows, token } = await createOneUserAddress()

//     await api
//       .delete(`${apiURL}/${userID}/${follows}`)
//       .set('Cookie', `token=${token}`)
//       .expect(204)
//   })

//   test('403 if another same user', async () => {
//     const { userID, follows } = await createOneUserAddress()
//     const { token } = await loginAs('admin', api)

//     await api
//       .delete(`${apiURL}/${userID}/${follows}`)
//       .set('Cookie', `token=${token}`)
//       .expect(403)
//   })
// })

afterAll(async () => await db.destroy())
