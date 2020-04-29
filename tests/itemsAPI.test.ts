import supertest from 'supertest'
import app from '../src/app'
import { itemsInDB, loginAs, populateUsers } from './testHelper'

const api = supertest(app)

beforeEach(async () => {
  await populateUsers()
})

describe('addin item', () => {
  test('should create item', async () => {
    const { token, id } = await loginAs('root', api)

    const newItem = {
      name: 'New Item',
      price: 13879,
      shortDescription: 'Cool Item',
      longDescription: 'Very Cool Item',
      stock: 34,
      asin: 'ftftf-54-4ff',
      media: 5,
      primaryMedia: 0,
      user: id,
      category: 'Great Stuff',
      vendor: 'Demix'
    }

    await api
      .post('/api/items')
      .set('Cookie', `token=${token}`)
      .send(newItem)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const itemsAtEnd = await itemsInDB()
    const longDescriptions = itemsAtEnd.map((i) => i.longDescription)
    expect(longDescriptions).toContain('Very Cool Item')
  })

  test('should fail signup with 400 code if price is not provided', async () => {
    const { token, id } = await loginAs('root', api)

    const newItem = {
      name: 'New Item',
      shortDescription: 'Cool Item',
      longDescription: 'Very Cool Item',
      stock: 34,
      asin: 'ftftf-54-4ff',
      media: 5,
      primaryMedia: 0,
      user: id,
      category: 'Great Stuff',
      vendor: 'Demix'
    }

    await api
      .post('/api/items')
      .set('Cookie', `token=${token}`)
      .send(newItem)
      .expect(400)
  })
})

describe('item fetching and updating', () => {
  test('should get 200 fetching items', async () => {
    const { token, id } = await loginAs('root', api)

    const newItem = {
      name: 'New Item',
      price: 13879,
      shortDescription: 'Cool Item',
      longDescription: 'Very Cool Item',
      stock: 34,
      asin: 'ftftf-54-4ff',
      media: 5,
      primaryMedia: 0,
      user: id,
      category: 'Great Stuff',
      vendor: 'Demix'
    }

    await api
      .post('/api/items')
      .set('Cookie', `token=${token}`)
      .send(newItem)

    const res = await api
      .get('/api/items')
      .expect(200)

    expect(Object.keys(res.body[0])).toHaveLength(13)
  })

  test('should get public item fields if not root', async () => {
    const { token, id } = await loginAs('root', api)

    const newItem = {
      name: 'New Item',
      price: 13879,
      shortDescription: 'Cool Item',
      longDescription: 'Very Cool Item',
      stock: 34,
      asin: 'ftftf-54-4ff',
      media: 5,
      primaryMedia: 0,
      user: id,
      category: 'Great Stuff',
      vendor: 'Demix'
    }

    const resNewItem = await api
      .post('/api/items')
      .set('Cookie', `token=${token}`)
      .send(newItem)

    const resItem = await api
      .get(`/api/items/${resNewItem.body.id}`)
      .expect(200)

    expect(Object.keys(resItem.body)).toHaveLength(13)
  })

  test('should get all item fields if root', async () => {
    const { token, id } = await loginAs('root', api)

    const newItem = {
      name: 'New Item',
      price: 13879,
      shortDescription: 'Cool Item',
      longDescription: 'Very Cool Item',
      stock: 34,
      asin: 'ftftf-54-4ff',
      media: 5,
      primaryMedia: 0,
      user: id,
      category: 'Great Stuff',
      vendor: 'Demix'
    }

    const resNewItem = await api
      .post('/api/items')
      .set('Cookie', `token=${token}`)
      .send(newItem)

    const resItem = await api
      .get(`/api/items/${resNewItem.body.id}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(Object.keys(resItem.body)).toHaveLength(16)
  })

  //   test('should get 200 when updating own profile', async () => {
  //     const item = {
  //       email: 'item@example.com',
  //       password: '12345678'
  //     }

  //     const resLogin = await api
  //       .post('/api/items/login')
  //       .send(item)
  //       .expect(200)

  //     const token = resLogin.header['set-cookie'][0].split('; ')[0].slice(6)

  //     const resItem = await api
  //       .put(`/api/items/${resLogin.body.id}`)
  //       .set('Cookie', `token=${token}`)
  //       .send({ name: 'Jack' })
  //       .expect(200)

  //     expect(Object.keys(resItem.body)).toHaveLength(7)
  //     expect(resItem.body.name === 'Jack')
  //   })

  //   test('should get 403 when updating another item\'s profile', async () => {
  //     const item = {
  //       email: 'item@example.com',
  //       password: '12345678'
  //     }

  //     const resLogin = await api
  //       .post('/api/items/login')
  //       .send(item)
  //       .expect(200)

  //     const token = resLogin.header['set-cookie'][0].split('; ')[0].slice(6)

  //     const anotherItem = await getItemByEmail('admin@example.com')

//     await api
//       .put(`/api/items/${anotherItem.id}`)
//       .set('Cookie', `token=${token}`)
//       .send({ name: 'Jack' })
//       .expect(403)
//   })
})
// describe('when there is initially some notes saved', () => {
//   test('notes are returned as json', async () => {
//     await api
//       .get('/api/notes')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//   })

//   test('all notes are returned', async () => {
//     const res = await api.get('/api/notes')

//     expect(res.body).toHaveLength(initialNotes.length)
//   })

//   test('a specific note is within the returned notes', async () => {
//     const res = await api.get('/api/notes')
//     const contents = res.body.map((n: Note) => n.content)

//     expect(contents).toContain('Browser can execute only Javascript')
//   })

//   describe('viewing a specific note', () => {
//     test('succeeds with a valid id', async () => {
//       const notesAtStart = await notesInDB()
//       const noteToView = notesAtStart[0]

//       const resultNote = await api.get(`/api/notes/${noteToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/)

//       expect(JSON.stringify(resultNote.body)).toEqual(JSON.stringify(noteToView))
//     })

//     test('fails with statuscode 404 if note does not exist', async () => {
//       const validNonexistingId = await nonExistingID()

//       await api
//         .get(`/api/notes/${validNonexistingId}`)
//         .expect(404)
//     })

//     test('fails with statuscode 400 if id is invalid', async () => {
//       const invalidID = '5a3d5da59070081a82a3445'

//       await api
//         .get(`/api/notes/${invalidID}`)
//         .expect(400)
//     })
//   })

//   describe('addition of a new note', () => {
//     test('succeeds with valid data', async () => {
//       const newNote = {
//         content: 'async/await simplifies making async calls',
//         important: true
//       }

//       await api
//         .post('/api/notes')
//         .send(newNote)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)

//       const notesAtEnd = await notesInDB()
//       const contents = notesAtEnd.map((n: Note) => n.content)

//       expect(notesAtEnd).toHaveLength(initialNotes.length + 1)
//       expect(contents).toContain('async/await simplifies making async calls')
//     })

//     test('fails with status code 400 if data is invaild', async () => {
//       const newNote = { important: true }

//       await api
//         .post('/api/notes')
//         .send(newNote)
//         .expect(400)

//       const notesAtEnd = await notesInDB()

//       expect(notesAtEnd).toHaveLength(initialNotes.length)
//     })
//   })

//   describe('deletion of a note', () => {
//     test('a note can be deleted', async () => {
//       const notesAtStart = await notesInDB()
//       const noteToDelete = notesAtStart[0]

//       await api
//         .delete(`/api/notes/${noteToDelete.id}`)
//         .expect(204)

//       const notesAtEnd = await notesInDB()
//       const contents = notesAtEnd.map((n) => n.content)

//       expect(notesAtEnd).toHaveLength(initialNotes.length - 1)
//       expect(contents).not.toContain(noteToDelete.content)
//     })
//   })
// })

// describe('when there is initially one item at db', () => {
//   beforeEach(async () => {
//     await Item.deleteMany({})

//     const passwordHash = await bcrypt.hash('sekret', 10)
//     const item = new Item({ itemname: 'root', passwordHash })

//     await item.save()
//   })

//   test('creation succeeds with a fresh itemname', async () => {
//     const itemsAtStart = await itemsInDB()

//     const newItem = {
//       itemname: 'mluukkai',
//       name: 'Matti Luukkainen',
//       password: 'salainen'
//     }

//     await api
//       .post('/api/items')
//       .send(newItem)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)

//     const itemsAtEnd = await itemsInDB()
//     expect(itemsAtEnd).toHaveLength(itemsAtStart.length + 1)

//     const itemnames = itemsAtEnd.map((u) => u.itemname)
//     expect(itemnames).toContain(newItem.itemname)
//   })

//   test('creation fails with proper statuscode and message if itemname already taken', async () => {
//     const itemsAtStart = await itemsInDB()

//     const newItem = {
//       itemname: 'root',
//       name: 'Superitem',
//       password: 'salainen'
//     }

//     const result = await api
//       .post('/api/items')
//       .send(newItem)
//       .expect(400)
//       .expect('Content-Type', 'text/html; charset=utf-8')

//     expect(result.text).toContain('`itemname` to be unique')

//     const itemsAtEnd = await itemsInDB()
//     expect(itemsAtEnd).toHaveLength(itemsAtStart.length)
//   })
// })

// afterAll(() => await prisma.disconnect())
