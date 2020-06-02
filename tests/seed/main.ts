import path from 'path'
import R from 'ramda'
import supertest from 'supertest'
import app from '../../src/app'
import { AddressType } from '../../src/types'
import { apiURLs } from '../../src/utils/constants'
import { db } from '../../src/utils/db'
import { populateUsers, purge, createOneCategory, createOneVendor, loginAs } from '../testHelper'
import { initialUsers, initialProducts } from './seedData'

const api = supertest(app)

const seed = async (): Promise<void> => {
  try {
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
    }))

    await Promise.all(users.map(async (u) => {
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

    const products = R.flatten(await Promise.all(Object.entries(initialProducts).map(async (c) => {
      const { token, userID } = await loginAs('admin')
      const { addedCategory } = await createOneCategory('admin', c[0])

      return await Promise.all(Object.entries(c[1]).map(async (v) => {
        const { addedVendor } = await createOneVendor('admin', v[0])

        return await Promise.all(v[1].map(async (p, i) => {
          const { body } = await api
            .post(apiURLs.products)
            .set('Cookie', `token=${token}`)
            .send({
              ...p,
              userID,
              categoryID: addedCategory.categoryID,
              vendorID: addedVendor.vendorID
            })
          console.info('p.media', p.media)

          if (p.media) {
            const uploadAPI = api
              .post(`${apiURLs.products}/${body.productID}/upload`)
              .set('Cookie', `token=${token}`)

            const mediaRange = [ ...Array(p.media).keys() ]

            mediaRange.map((m) => {
              uploadAPI
                .attach('productMedia', path.join(
                  __dirname, `images/products/${i}_${m}.jpg`
                ))
            })
            await uploadAPI
          }
          return body
        }))
      }))
    })))

    const newList1 = await api
      .post(apiURLs.lists)
      .set('Cookie', `token=${users[0].token}`)
      .send({ name: 'Wishlist' })

    await api
      .post(
        `${apiURLs.lists}/${newList1.body.listID}/products/${products[0].productID}`
      )
      .set('Cookie', `token=${users[0].token}`)

    await api
      .post(
        `${apiURLs.lists}/${newList1.body.listID}/products/${products[1].productID}`
      )
      .set('Cookie', `token=${users[0].token}`)

    const newList2 = await api
      .post(apiURLs.lists)
      .set('Cookie', `token=${users[2].token}`)
      .send({ name: 'Stuff to buy' })

    await api
      .post(
        `${apiURLs.lists}/${newList2.body.listID}/products/${products[2].productID}`
      )
      .set('Cookie', `token=${users[2].token}`)
  } catch (error) { console.error(error) }
}

seed().then(async () => await db.destroy())
