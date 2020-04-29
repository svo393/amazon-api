import { Item, PrismaClient, User } from '@prisma/client'
import supertest from 'supertest'
import userService from '../src/services/userService'
import StatusError from '../src/utils/StatusError'

const prisma = new PrismaClient()

export const user = {
  email: 'customer@example.com',
  password: '12345678'
}

export const admin = {
  email: 'admin@example.com',
  password: '12345678'
}

export const root = {
  email: 'root@example.com',
  password: '12345678'
}

export const populateUsers = async (): Promise<string | void> => {
  try {
    await prisma.item.deleteMany({})
    await prisma.user.deleteMany({})
    const userData = await userService.addUser(user)

    await userService.addUser(admin)

    await prisma.user.update({
      where: { email: admin.email },
      data: { role: 'ADMIN' }
    })

    await userService.addUser(root)

    await prisma.user.update({
      where: { email: root.email },
      data: { role: 'ROOT' }
    })
    await prisma.disconnect()
    return userData.id
  } catch (err) {
    console.error(err)
  }
}

export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await prisma.user.findOne({ where: { email } })
  await prisma.disconnect()

  if (!user) { throw new StatusError(404, 'Not Found') }
  return user
}

export const usersInDB = async (): Promise<User[]> => {
  const users = await prisma.user.findMany()
  await prisma.disconnect()
  return users
}

export const itemsInDB = async (): Promise<Item[]> => {
  const items = await prisma.item.findMany()
  await prisma.disconnect()
  return items
}

export const loginAs: (role: string, api: supertest.SuperTest<supertest.Test>) => Promise<{token: string; id: string}> =
async (role, api) => {
  const user = {
    email: `${role}@example.com`,
    password: '12345678'
  }

  const res = await api
    .post('/api/users/login')
    .send(user)

  const token = res.header['set-cookie'][0].split('; ')[0].slice(6)
  return { token, id: res.body.id }
}
