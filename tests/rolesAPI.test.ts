import supertest from 'supertest'
import app from '../src/app'
import { db } from '../src/utils/db'
import { Role, RoleInput } from '../src/types'
import { loginAs, populateUsers, purge, rolesInDB } from './testHelper'

const api = supertest(app)
const apiURL = '/api/roles'

const newRole = (): RoleInput => ({
  name: `New Role ${(new Date().getTime()).toString()}`
})

const createOneRole = async (role: string): Promise<{ addedRole: Role; token: string}> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURL)
    .set('Cookie', `token=${token}`)
    .send(newRole())

  return { addedRole: body, token }
}

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('Role adding', () => {
  test('201', async () => {
    const { token } = await loginAs('root', api)
    const rolesAtStart = await rolesInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newRole())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const rolesAtEnd = await rolesInDB()
    expect(rolesAtEnd).toHaveLength(rolesAtStart.length + 1)
  })

  test('403 if not root', async () => {
    const { token } = await loginAs('admin', api)

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newRole())
      .expect(403)
  })
})

describe('Roles fetching', () => {
  test('200 roles', async () => {
    await api
      .get(apiURL)
      .expect(403)
  })

  test('200 role if root', async () => {
    const { addedRole, token } = await createOneRole('root')

    const { body } = await api
      .get(`${apiURL}/${addedRole.roleID}`)
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(body).toBeDefined()
  })
})

describe('Role updating', () => {
  test('200 if root', async () => {
    const { addedRole, token } = await createOneRole('root')

    const { body } = await api
      .put(`${apiURL}/${addedRole.roleID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated Role ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.name).toContain('Updated Role')
  })

  test('403 if not root', async () => {
    const { addedRole } = await createOneRole('root')
    const { token } = await loginAs('admin', api)

    await api
      .put(`${apiURL}/${addedRole.roleID}`)
      .set('Cookie', `token=${token}`)
      .send({ name: `Updated Role ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
