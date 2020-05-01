import supertest from 'supertest'
import app from '../src/app'
import { ItemCreateInputRaw } from '../src/types'
import { itemsInDB, loginAs, populateUsers } from './testHelper'
import path from 'path'

const api = supertest(app)
const apiURL = '/api/items'

const newItem = (id: string): ItemCreateInputRaw => ({
  name: 'New Item',
  price: 13879,
  shortDescription: 'Cool Item',
  longDescription: 'Very Cool Item',
  stock: 34,
  asin: (new Date().getTime()).toString(),
  media: 5,
  primaryMedia: 0,
  user: id,
  category: 'Great Stuff',
  vendor: 'Demix'
})

const createOneItem = async (role = 'root'): Promise<any> => {
  const { token, id } = await loginAs(role, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(newItem(id))

  return { addedItem: body, token }
}

beforeEach(async () => {
  await populateUsers()
})

describe('Item adding', () => {
  test('200', async () => {
    const { token, id } = await loginAs('root', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newItem(id))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const itemsAtEnd = await itemsInDB()
    const longDescriptions = itemsAtEnd.map((i) => i.longDescription)
    expect(longDescriptions).toContain('Very Cool Item')
  })

  test('400 if no price', async () => {
    const { token, id } = await loginAs('root', api)

    const newItemWithoutPrice = { ...newItem(id), price: undefined }

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newItemWithoutPrice)
      .expect(400)
  })

  test('204 upload file if admin or root', async () => {
    const { token } = await loginAs('admin', api)
    const { addedItem } = await createOneItem('admin')

    await api
      .post(`${apiURL}/${addedItem.id}/upload`)
      .set('Cookie', `token=${token}`)
      .attach('itemMedia', path.join(__dirname, 'test-image.png'))
      .attach('itemMedia', path.join(__dirname, 'test-image2.png'))
      .expect(204)
  })

  test('403 upload file if not admin or root', async () => {
    const { addedItem } = await createOneItem()

    await api
      .post(`${apiURL}/${addedItem.id}/upload`)
      .attach('itemMedia', path.join(__dirname, 'test-image.png'))
      .attach('itemMedia', path.join(__dirname, 'test-image2.png'))
      .expect(403)
  })

  test('400 upload file if no file', async () => {
    const { token } = await loginAs('admin', api)
    const { addedItem } = await createOneItem('admin')

    await api
      .post(`${apiURL}/${addedItem.id}/upload`)
      .set('Cookie', `token=${token}`)
      .expect(400)
  })
})

describe('Item fetching', () => {
  test('200', async () => {
    await createOneItem()

    const { body } = await api
      .get(apiURL)
      .expect(200)

    expect(body).toBeDefined()
  })

  test('public item if not admin or root', async () => {
    const { addedItem } = await createOneItem()

    const { body } = await api
      .get(`${apiURL}/${addedItem.id}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(15)
  })

  test('full item if admin or root', async () => {
    const { addedItem, token } = await createOneItem('admin')

    const { body } = await api
      .get(`${apiURL}/${addedItem.id}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(18)
  })
})

describe('Item updating', () => {
  test('200 if own item', async () => {
    const { addedItem, token } = await createOneItem()

    const { body } = await api
      .put(`${apiURL}/${addedItem.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Item' })
      .expect(200)

    expect(body.name).toBe('Updated Item')
  })

  test('403 if another user\'s item', async () => {
    const { token } = await createOneItem('admin')
    const { addedItem: anotherAddedItem } = await createOneItem()

    await api
      .put(`${apiURL}/${anotherAddedItem.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Item' })
      .expect(403)
  })
})
