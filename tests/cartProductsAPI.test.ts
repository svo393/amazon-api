import supertest from 'supertest'
import app from '../src/app'
import { CartProduct } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { cartProductsInDB, createOneCartProduct, loginAs, newCartProduct, populateUsers, purge, createOneProduct } from './testHelper'

const api = supertest(app)

const apiURL = apiURLs.users

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('CartProduct adding', () => {
  test('201', async () => {
    const { token, userID } = await loginAs('customer')
    const { addedProduct } = await createOneProduct('admin')
    const cartProductsAtStart = await cartProductsInDB()

    await api
      .post(`${apiURL}/${userID}/cartProducts`)
      .set('Cookie', `token=${token}`)
      .send(newCartProduct(userID, addedProduct.productID))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const cartProductsAtEnd = await cartProductsInDB()
    expect(cartProductsAtEnd).toHaveLength(cartProductsAtStart.length + 1)
  })
})

describe('CartProducts fetching', () => {
  test('200 cartProducts by user', async () => {
    const { addedCartProduct, token } = await createOneCartProduct('customer')

    const { body }: { body: CartProduct[] } = await api
      .get(`${apiURL}/${addedCartProduct.userID}/cartProducts`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('200 cartProduct', async () => {
    const { addedCartProduct, token } = await createOneCartProduct('customer')

    const { body } = await api
      .get(`${apiURL}/${addedCartProduct.userID}/cartProducts/${addedCartProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('CartProduct updating', () => {
  test('200 if same user', async () => {
    const { addedCartProduct, token } = await createOneCartProduct('customer')

    const { body } = await api
      .put(`${apiURL}/${addedCartProduct.userID}/cartProducts/${addedCartProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send({ qty: 5 })
      .expect(200)

    expect(body.qty).toBe(5)
  })

  test('403 if not same user', async () => {
    const { addedCartProduct } = await createOneCartProduct('admin')
    const { token } = await loginAs('customer')

    await api
      .put(`${apiURL}/${addedCartProduct.userID}/cartProducts/${addedCartProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send({ qty: 5 })
      .expect(403)
  })
})

describe('CartProducts deleting', () => {
  test('204 if same user', async () => {
    const { addedCartProduct, token } = await createOneCartProduct('customer')

    await api
      .delete(`${apiURL}/${addedCartProduct.userID}/cartProducts/${addedCartProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })
})

afterAll(async () => await db.destroy())
