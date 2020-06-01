import { apiURLs } from '../../src/utils/constants'
import { db } from '../../src/utils/db'
import supertest from 'supertest'
import app from '../../src/app'
import { purge, populateUsers } from '../testHelper'
import { init } from '../../db/init'

const api = supertest(app)

const seed = async (): Promise<void> => {
  await purge()
  await init()
  await populateUsers()
  await db.destroy()
}

seed()
