import { apiURLs } from '../../src/utils/constants'
import { db } from '../../src/utils/db'
import supertest from 'supertest'
import app from '../../src/app'
import { purge, populateUsers } from '../testHelper'
import { init } from '../../db/init'
import R from 'ramda'
import path from 'path'

const api = supertest(app)

const initialUsers = [
  {
    email: 'bob@example.com',
    password: '0q7#Wy#WHyKX',
    name: 'Bob Smith',
    avatar: true,
    info: 'Work on electronics to maintain their electrical component. Enjoy testing the durability of items.'
  },
  {
    email: 'alice@example.com',
    password: '8I&o9FSv%VrU',
    name: 'Alice',
    avatar: true,
    info: 'Wife... & Mother of 3. Love Shopping ( mainly on Amazon!) and Crafting. Addicted to my Cricut, Home Renovation shows and my kiddos.'
  },
  {
    email: 'john@example.com',
    password: 'VgJ48q&8%^Dm',
    name: 'Jools'
  },
  {
    email: 'mary@example.com',
    password: 'p2&MR5w$Z7pF',
    name: 'Marette',
    avatar: true,
    info: 'I run a home-based business. I don\'t have time to go to the store all the time so I shop on amazon. We donate a lot to our local animal shelter and help with fundraisers, so we are always in need of giveaways. Amazon is always our go-to for all our home, office needs, donation needs. Please do not contact me for doing reviews. I do reviews on what I purchase already.'
  }
]

const seed = async (): Promise<void> => {
  await purge()
  await populateUsers()

  const users = await Promise.all(initialUsers.map(async (u) => {
    const res = await api
      .post(apiURLs.users)
      .send({ email: u.email, password: u.password })

    return {
      ...u,
      userID: res.body.userID,
      token: res.header['set-cookie'][0].split('; ')[0].slice(6)
    }
  }))

  await Promise.all(users.map(async (u) => {
    await api
      .put(`${apiURLs.users}/${u.userID}`)
      .set('Cookie', `token=${u.token}`)
      .send(R.omit([ 'email', 'password', 'userID', 'token' ], u))
  }))

  await Promise.all(users.map(async (u) => {
    const nameMatch = /^\w+?(?=@)/.exec(u.email)

    nameMatch && u.avatar && await api
      .post(`${apiURLs.users}/${u.userID}/upload`)
      .set('Cookie', `token=${u.token}`)
      .attach('userAvatar', path.join(
        __dirname, `images/avatars/${nameMatch[0]}.jpg`
      ))
  }))
}

seed().then(async () => await db.destroy())
