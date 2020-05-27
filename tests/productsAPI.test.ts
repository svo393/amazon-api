import path from 'path'
import supertest from 'supertest'
import app from '../src/app'
import { ProductPublicData } from '../src/types'
import { products } from './seedData'
import { productsInDB, loginAs, populateUsers, purge } from './testHelper'
import { db } from '../src/utils/db'
import { createOneCategory } from './categoriesAPI.test'
import { createOneVendor } from './vendorsAPI.test'

const api = supertest(app)
const apiURL = '/api/products'

const newProduct = products[0]

const createOneProduct = async (role: string, vendorName?: string, categoryName?: string, parentCategoryID?: number): Promise<{addedProduct: ProductPublicData; token: string}> => {
  const { addedCategory } = await createOneCategory(role, categoryName, parentCategoryID)
  const { addedVendor } = await createOneVendor(role, vendorName)
  const { token, userID } = await loginAs(role, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send({
      ...newProduct,
      userID,
      categoryID: addedCategory.categoryID,
      vendorID: addedVendor.vendorID
    })
  return { addedProduct: body, token }
}

beforeEach(async () => {
  await purge()
  await populateUsers(api)
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
        vendorID: addedVendor.vendorID
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const productsAtEnd = await productsInDB()
    const descriptions = productsAtEnd.map((i) => i.description)
    expect(descriptions).toContain(products[0].description)
  })

  // test('400 if no price', async () => {
  //   const { token, userID } = await loginAs('root', api)

  //   const newProductWithoutPrice = {
  //     ...newProduct,
  //     userID,
  //     price: undefined
  //   }

  //   await api
  //     .post(apiURL)
  //     .set('Cookie', `token=${token}`)
  //     .send(newProductWithoutPrice)
  //     .expect(400)
  // })

  // test('204 upload file if admin or root', async () => {
  //   const { token } = await loginAs('admin', api)
  //   const { addedProduct } = await createOneProduct('admin')

  //   await api
  //     .post(`${apiURL}/${addedProduct.id}/upload`)
  //     .set('Cookie', `token=${token}`)
  //     .attach('productMedia', path.join(__dirname, 'test-image.png'))
  //     .attach('productMedia', path.join(__dirname, 'test-image2.png'))
  //     .expect(204)
  // })

  // test('403 upload file if not admin or root', async () => {
  //   const { addedProduct } = await createOneProduct('root')

  //   await api
  //     .post(`${apiURL}/${addedProduct.id}/upload`)
  //     .attach('productMedia', path.join(__dirname, 'test-image.png'))
  //     .attach('productMedia', path.join(__dirname, 'test-image2.png'))
  //     .expect(403)
  // })

  // test('400 upload file if no file', async () => {
  //   const { token } = await loginAs('admin', api)
  //   const { addedProduct } = await createOneProduct('admin')

  //   await api
  //     .post(`${apiURL}/${addedProduct.id}/upload`)
  //     .set('Cookie', `token=${token}`)
  //     .expect(400)
  // })
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
    expect(Object.keys(body)).toHaveLength(7)
  })

  test('full product if admin or root', async () => {
    const { addedProduct, token } = await createOneProduct('admin')

    const { body } = await api
      .get(`${apiURL}/${addedProduct.productID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(10)
  })
})

// describe('Product updating', () => {
//   test('200 if own product', async () => {
//     const { addedProduct, token } = await createOneProduct('root')

//     const { body } = await api
//       .put(`${apiURL}/${addedProduct.id}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Updated Product' })
//       .expect(200)

//     expect(body.name).toBe('Updated Product')
//   })

//   test('403 if another user\'s product', async () => {
//     const { token } = await createOneProduct('admin')
//     const { addedProduct: anotherAddedProduct } = await createOneProduct('root')

//     await api
//       .put(`${apiURL}/${anotherAddedProduct.id}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Updated Product' })
//       .expect(403)
//   })
// })

afterAll(async () => await db.destroy())
