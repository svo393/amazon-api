import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../src/app'
import Note from '../src/models/note'
import User from '../src/models/user'
import { initialNotes, nonExistingID, notesInDB, usersInDB } from './test_helper'

const api = supertest(app)

interface Note {
  content: string;
  important: boolean;
  date: Date;
  id: string;
}

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = initialNotes.map((n) => new Note(n))
  const promiseArray = noteObjects.map((n) => n.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const res = await api.get('/api/notes')

    expect(res.body).toHaveLength(initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const res = await api.get('/api/notes')
    const contents = res.body.map((n: Note) => n.content)

    expect(contents).toContain('Browser can execute only Javascript')
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await notesInDB()
      const noteToView = notesAtStart[0]

      const resultNote = await api.get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(JSON.stringify(resultNote.body)).toEqual(JSON.stringify(noteToView))
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await nonExistingID()

      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidID = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${invalidID}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await notesInDB()
      const contents = notesAtEnd.map((n: Note) => n.content)

      expect(notesAtEnd).toHaveLength(initialNotes.length + 1)
      expect(contents).toContain('async/await simplifies making async calls')
    })

    test('fails with status code 400 if data is invaild', async () => {
      const newNote = { important: true }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await notesInDB()

      expect(notesAtEnd).toHaveLength(initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('a note can be deleted', async () => {
      const notesAtStart = await notesInDB()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await notesInDB()
      const contents = notesAtEnd.map((n) => n.content)

      expect(notesAtEnd).toHaveLength(initialNotes.length - 1)
      expect(contents).not.toContain(noteToDelete.content)
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDB()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDB()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', 'text/html; charset=utf-8')

    expect(result.text).toContain('`username` to be unique')

    const usersAtEnd = await usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => mongoose.connection.close())
