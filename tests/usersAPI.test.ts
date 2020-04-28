import supertest from 'supertest'
import app from '../src/app'
import { populateUsers, usersInDB, getUserByEmail } from './testHelper'

const api = supertest(app)

beforeEach(async () => {
  await populateUsers()
})

describe('user authorization', () => {
  test('should signup', async () => {
    const newUser = {
      email: 'user2@example.com',
      password: '12345678'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDB()
    const emails = usersAtEnd.map((u) => u.email)
    expect(emails).toContain('user@example.com')
  })

  test('should fail signup with 400 code if email is not provided', async () => {
    const newUser = {
      password: '12345678'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('should login and logout with token deletion', async () => {
    const user = {
      email: 'user@example.com',
      password: '12345678'
    }

    const resLogin = await api
      .post('/api/users/login')
      .send(user)
      .expect(200)

    const token = resLogin.header['set-cookie'][0].split('; ')[0].slice(6)

    const resLogout = await api
      .post('/api/users/logout')
      .set('Cookie', `token=${token}`)
      .expect(302)

    expect(resLogout.header['set-cookie'][0].split('; ')[0].slice(6)).toHaveLength(0)
  })
})

describe('user fetching and updating', () => {
  test('should get 403 trying fetch users if not root', async () => {
    const user = {
      email: 'user@example.com',
      password: '12345678'
    }

    const res = await api
      .post('/api/users/login')
      .send(user)
      .expect(200)

    const token = res.header['set-cookie'][0].split('; ')[0].slice(6)

    await api
      .get('/api/users')
      .set('Cookie', `token=${token}`)
      .expect(403)
  })

  test('should get 200 trying fetch users if root', async () => {
    const user = {
      email: 'root@example.com',
      password: '12345678'
    }

    const res = await api
      .post('/api/users/login')
      .send(user)
      .expect(200)

    const token = res.header['set-cookie'][0].split('; ')[0].slice(6)

    await api
      .get('/api/users')
      .set('Cookie', `token=${token}`)
      .expect(200)
  })

  test('should get public user fields if not logged in', async () => {
    const anotherUser = await getUserByEmail('admin@example.com')

    const resUser = await api
      .get(`/api/users/${anotherUser.id}`)
      .expect(200)

    expect(Object.keys(resUser.body)).toHaveLength(3)
  })

  test('should get all user fields if root', async () => {
    const user = {
      email: 'root@example.com',
      password: '12345678'
    }

    const resLogin = await api
      .post('/api/users/login')
      .send(user)
      .expect(200)

    const token = resLogin.header['set-cookie'][0].split('; ')[0].slice(6)

    const anotherUser = await getUserByEmail('admin@example.com')

    const resUser = await api
      .get(`/api/users/${anotherUser.id}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(Object.keys(resUser.body)).toHaveLength(7)
  })

  test('should get 200 when updating own profile', async () => {
    const user = {
      email: 'user@example.com',
      password: '12345678'
    }

    const resLogin = await api
      .post('/api/users/login')
      .send(user)
      .expect(200)

    const token = resLogin.header['set-cookie'][0].split('; ')[0].slice(6)

    const resUser = await api
      .put(`/api/users/${resLogin.body.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Jack' })
      .expect(200)

    expect(Object.keys(resUser.body)).toHaveLength(7)
    expect(resUser.body.name === 'Jack')
  })

  test('should get 403 when updating another user\'s profile', async () => {
    const user = {
      email: 'user@example.com',
      password: '12345678'
    }

    const resLogin = await api
      .post('/api/users/login')
      .send(user)
      .expect(200)

    const token = resLogin.header['set-cookie'][0].split('; ')[0].slice(6)

    const anotherUser = await getUserByEmail('admin@example.com')

    await api
      .put(`/api/users/${anotherUser.id}`)
      .set('Cookie', `token=${token}`)
      .send({ name: 'Jack' })
      .expect(403)
  })
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

// describe('when there is initially one user at db', () => {
//   beforeEach(async () => {
//     await User.deleteMany({})

//     const passwordHash = await bcrypt.hash('sekret', 10)
//     const user = new User({ username: 'root', passwordHash })

//     await user.save()
//   })

//   test('creation succeeds with a fresh username', async () => {
//     const usersAtStart = await usersInDB()

//     const newUser = {
//       username: 'mluukkai',
//       name: 'Matti Luukkainen',
//       password: 'salainen'
//     }

//     await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)

//     const usersAtEnd = await usersInDB()
//     expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

//     const usernames = usersAtEnd.map((u) => u.username)
//     expect(usernames).toContain(newUser.username)
//   })

//   test('creation fails with proper statuscode and message if username already taken', async () => {
//     const usersAtStart = await usersInDB()

//     const newUser = {
//       username: 'root',
//       name: 'Superuser',
//       password: 'salainen'
//     }

//     const result = await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(400)
//       .expect('Content-Type', 'text/html; charset=utf-8')

//     expect(result.text).toContain('`username` to be unique')

//     const usersAtEnd = await usersInDB()
//     expect(usersAtEnd).toHaveLength(usersAtStart.length)
//   })
// })

// afterAll(() => await prisma.disconnect())
