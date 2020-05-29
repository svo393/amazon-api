import path from 'path'
import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { products } from './seedData'
import { createOneCategory, createOneProduct, createOneVendor, loginAs, newProduct, populateUsers, productsInDB, purge, parametersInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.products

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Product adding', () => {
  test('201', async () => {
    const { addedCategory } = await createOneCategory('admin', 'Desktops')
    const { addedVendor } = await createOneVendor('admin', 'Acer')
    const { token, userID } = await loginAs('root', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send({
        ...newProduct,
        userID,
        categoryID: addedCategory.categoryID,
        vendorID: addedVendor.vendorID,
        parameters: [
          { name: 'weight', value: 120 },
          { name: 'memory', value: 'DDR4' }
        ]
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const productsAtEnd = await productsInDB()
    const parametersAtEnd = await parametersInDB()
    const descriptions = productsAtEnd.map((i) => i.description)
    expect(descriptions).toContain(products[0].description)
  })

  test('400 if no price', async () => {
    const { addedCategory } = await createOneCategory('admin', 'Desktops')
    const { addedVendor } = await createOneVendor('admin', 'Acer')
    const { token, userID } = await loginAs('root', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send({
        ...newProduct,
        userID,
        categoryID: addedCategory.categoryID,
        vendorID: addedVendor.vendorID,
        price: undefined
      })
      .expect(400)
  })

  test('204 upload file if admin or root', async () => {
    const { addedProduct } = await createOneProduct('admin')
    const { token } = await loginAs('admin', api)

    await api
      .post(`${apiURL}/${addedProduct.productID}/upload`)
      .set('Cookie', `token=${token}`)
      .attach('productMedia', path.join(__dirname, 'test-image.png'))
      .attach('productMedia', path.join(__dirname, 'test-image2.png'))
      .expect(204)
  })

  test('403 upload file if not admin or root', async () => {
    const { addedProduct } = await createOneProduct('root')
    const { token } = await loginAs('customer', api)

    await api
      .post(`${apiURL}/${addedProduct.productID}/upload`)
      .set('Cookie', `token=${token}`)
      .attach('productMedia', path.join(__dirname, 'test-image.png'))
      .expect(403)
  })

  test('400 upload file if no file', async () => {
    const { addedProduct } = await createOneProduct('admin')
    const { token } = await loginAs('admin', api)

    await api
      .post(`${apiURL}/${addedProduct.productID}/upload`)
      .set('Cookie', `token=${token}`)
      .expect(400)
  })

  test('400 upload file if wrong type', async () => {
    const { addedProduct } = await createOneProduct('admin')
    const { token } = await loginAs('admin', api)

    await api
      .post(`${apiURL}/${addedProduct.productID}/upload`)
      .attach('productMedia', path.join(__dirname, 'test-non-image.json'))
      .set('Cookie', `token=${token}`)
      .expect(400)
  })
})

describe('Product fetching', () => {
  test('200', async () => {
    await createOneProduct('admin')

    const { body } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('public product if not admin or root', async () => {
    const { addedProduct } = await createOneProduct('admin')

    const { body } = await api
      .get(`${apiURL}/${addedProduct.productID}`)
      .expect(200)
    expect(Object.keys(body)).toHaveLength(8)
  })

  test('full product if admin or root', async () => {
    const { addedProduct, token } = await createOneProduct('admin')

    const { body } = await api
      .get(`${apiURL}/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(11)
  })
})

describe('Product updating', () => {
  test('200 if own product', async () => {
    const { addedProduct, token } = await createOneProduct('root')

    const { body } = await api
      .put(`${apiURL}/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send({ title: 'Updated Product' })
      .expect(200)

    expect(body.title).toBe('Updated Product')
  })

  test('403 if another user\'s product', async () => {
    const { token } = await createOneProduct('admin')
    const { addedProduct: anotherAddedProduct } = await createOneProduct('root')

    await api
      .put(`${apiURL}/${anotherAddedProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Product' })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
