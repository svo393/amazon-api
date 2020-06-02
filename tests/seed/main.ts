import path from 'path'
import R from 'ramda'
import supertest from 'supertest'
import app from '../../src/app'
import { apiURLs } from '../../src/utils/constants'
import { db } from '../../src/utils/db'
import { populateUsers, purge } from '../testHelper'
import { initialUsers } from './seedData'
import { AddressType } from '../../src/types'

const api = supertest(app)

const seed = async (): Promise<void> => {
  await purge()
  await populateUsers()

  const users = await Promise.all(initialUsers.map(async (u) => {
    const res = await api
      .post(apiURLs.users)
      .send({ email: u.email, password: u.password })

    return {
      ...u,
      userID: res.body.userID,
      token: res.header['set-cookie'][0].split('; ')[0].slice(6)
    }
  }))

  await Promise.all(users.map(async (u) => {
    await api
      .put(`${apiURLs.users}/${u.userID}`)
      .set('Cookie', `token=${u.token}`)
      .send(R.omit([ 'email', 'password', 'userID', 'token' ], u))
  }))

  const addressTypes = await api
    .get(apiURLs.addressTypes)

  const shippingAddressTypeID = addressTypes.body.find((at: AddressType) => at.name === 'SHIPPING')

  await Promise.all(users.map(async (u) => {
    const nameMatch = /^\w+?(?=@)/.exec(u.email)

    nameMatch && u.avatar && await api
      .post(`${apiURLs.users}/${u.userID}/upload`)
      .set('Cookie', `token=${u.token}`)
      .attach('userAvatar', path.join(
        __dirname, `images/avatars/${nameMatch[0]}.jpg`
      ))

    await api
      .post(apiURLs.addresses)
      .set('Cookie', `token=${u.token}`)
      .send({
        addr: u.address,
        addressTypeID: shippingAddressTypeID.addressTypeID
      })
  }))

  await api
    .post(`${apiURLs.users}/${users[0].userID}/follows/${users[3].userID}`)
    .set('Cookie', `token=${users[0].token}`)
    .send({ userID: users[0].userID, follows: users[3].userID })

  await api
    .post(`${apiURLs.users}/${users[1].userID}/follows/${users[2].userID}`)
    .set('Cookie', `token=${users[1].token}`)
    .send({ userID: users[0].userID, follows: users[3].userID })

  await api
    .post(`${apiURLs.users}/${users[2].userID}/follows/${users[3].userID}`)
    .set('Cookie', `token=${users[2].token}`)
    .send({ userID: users[0].userID, follows: users[3].userID })

  await api
    .post(`${apiURLs.users}/${users[1].userID}/follows/${users[0].userID}`)
    .set('Cookie', `token=${users[1].token}`)
    .send({ userID: users[0].userID, follows: users[3].userID })
}

seed().then(async () => await db.destroy())
