import supertest from 'supertest'
import app from '../src/app'
import { ItemCreateInputRaw } from '../src/types'
import { itemsInDB, loginAs, populateUsers } from './testHelper'

const api = supertest(app)

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
    .post('/api/items')
    .set('Cookie', `token=${token}`)
    .send(newItem(id))

  return { addedItem: body, token }
}

beforeEach(async () => {
  await populateUsers()
})

describe('Item adding', () => {
  test('200 adding', async () => {
    const { token, id } = await loginAs('root', api)

    await api
      .post('/api/items')
      .set('Cookie', `token=${token}`)
      .send(newItem(id))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const itemsAtEnd = await itemsInDB()
    const longDescriptions = itemsAtEnd.map((i) => i.longDescription)
    expect(longDescriptions).toContain('Very Cool Item')
  })

  test('400 adding if no price', async () => {
    const { token, id } = await loginAs('root', api)

    const newItemWithoutPrice = { ...newItem(id), price: undefined }

    await api
      .post('/api/items')
      .set('Cookie', `token=${token}`)
      .send(newItemWithoutPrice)
      .expect(400)
  })
})

describe('Item fetching', () => {
  test('200 fetching', async () => {
    await createOneItem()

    const { body } = await api
      .get('/api/items')
      .expect(200)

    expect(body).toBeDefined()
  })

  test('public item if not root', async () => {
    const { addedItem } = await createOneItem()

    const { body } = await api
      .get(`/api/items/${addedItem.id}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(15)
  })

  test('full tiem if root', async () => {
    const { addedItem, token } = await createOneItem()

    const { body } = await api
      .get(`/api/items/${addedItem.id}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(Object.keys(body)).toHaveLength(18)
  })
})

describe('Item updating', () => {
  test('200 if own item', async () => {
    const { addedItem, token } = await createOneItem()

    const { body } = await api
      .put(`/api/items/${addedItem.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Item' })
      .expect(200)

    expect(body.name).toBe('Updated Item')
  })

  test('403 if another user\'s item', async () => {
    const { token } = await createOneItem('admin')
    const { addedItem: anotherAddedItem } = await createOneItem()

    await api
      .put(`/api/items/${anotherAddedItem.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Updated Item' })
      .expect(403)
  })
})