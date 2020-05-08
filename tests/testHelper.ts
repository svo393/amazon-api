import { Category, Item, PrismaClient, User, Vendor } from '@prisma/client'
import supertest from 'supertest'
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

export const sleep = (ms: number): Promise<any> => new Promise((resolve) => setTimeout(resolve, ms))

export const purge = async (): Promise<void> => {
  try {
    await prisma.groupItem.deleteMany({})
    await prisma.group.deleteMany({})
    await prisma.itemParameter.deleteMany({})
    await prisma.parameter.deleteMany({})
    await prisma.item.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.vendor.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.disconnect()
  } catch (err) {
    console.error(err)
  }
}

export const populateUsers = async (api: supertest.SuperTest<supertest.Test>): Promise<void> => {
  try {
    await api
      .post('/api/users')
      .send(user)

    await api
      .post('/api/users')
      .send(admin)

    await prisma.user.update({
      where: { email: admin.email },
      data: { role: 'ADMIN' }
    })

    await api
      .post('/api/users')
      .send(root)

    await prisma.user.update({
      where: { email: root.email },
      data: { role: 'ROOT' }
    })
    await prisma.disconnect()
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

export const categoriesInDB = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany()
  await prisma.disconnect()
  return categories
}

export const vendorsInDB = async (): Promise<Vendor[]> => {
  const vendors = await prisma.vendor.findMany()
  await prisma.disconnect()
  return vendors
}

export const loginAs: (role: string, api: supertest.SuperTest<supertest.Test>) => Promise<{token: string; id: string}> =
async (role, api) => {
  const user = {
    email: `${role}@example.com`,
    password: '12345678',
    remember: true
  }

  const res = await api
    .post('/api/users/login')
    .send(user)

  const token = res.header['set-cookie'][0].split('; ')[0].slice(6)
  return { token, id: res.body.id }
}
