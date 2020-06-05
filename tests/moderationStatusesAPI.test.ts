import supertest from 'supertest'
import app from '../src/app'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { createOneModerationStatus, loginAs, newModerationStatus, populateUsers, purge, moderationStatusesInDB } from './testHelper'

const api = supertest(app)
const apiURL = apiURLs.moderationStatuses

beforeEach(async () => {
  await purge()
  await populateUsers()
})

describe('ModerationStatus adding', () => {
  test('201', async () => {
    const { token } = await loginAs('admin')
    const moderationStatusesAtStart = await moderationStatusesInDB()

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newModerationStatus())
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const moderationStatusesAtEnd = await moderationStatusesInDB()
    expect(moderationStatusesAtEnd).toHaveLength(moderationStatusesAtStart.length + 1)
  })

  test('403 if not admin', async () => {
    const { token } = await loginAs('customer')

    await api
      .post(apiURL)
      .set('Cookie', `token=${token}`)
      .send(newModerationStatus())
      .expect(403)
  })
})

describe('ModerationStatuses fetching', () => {
  test('200 moderationStatuses', async () => {
    const { token } = await loginAs('admin')

    await api
      .get(apiURL)
      .set('Cookie', `token=${token}`)
      .expect(200)
  })
})

describe('ModerationStatus updating', () => {
  test('200 if admin', async () => {
    const { addedModerationStatus, token } = await createOneModerationStatus('admin')

    const { body } = await api
      .put(`${apiURL}/${addedModerationStatus.moderationStatusName}`)
      .set('Cookie', `token=${token}`)
      .send({ moderationStatusName: `Updated ModerationStatus ${(new Date().getTime()).toString()}` })
      .expect(200)

    expect(body.moderationStatusName).toContain('Updated ModerationStatus')
  })

  test('403 if not admin', async () => {
    const { addedModerationStatus } = await createOneModerationStatus('admin')
    const { token } = await loginAs('customer')

    await api
      .put(`${apiURL}/${addedModerationStatus.moderationStatusName}`)
      .set('Cookie', `token=${token}`)
      .send({ moderationStatusName: `Updated ModerationStatus ${(new Date().getTime()).toString()}` })
      .expect(403)
  })
})

afterAll(async () => await db.destroy())
