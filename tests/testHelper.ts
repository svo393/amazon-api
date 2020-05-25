import { Item, PrismaClient } from '@prisma/client'
import supertest from 'supertest'
import { Category, Role, ShippingMethod, User, Vendor, Address, AddressType } from '../src/types'
import { db } from '../src/utils/db'
import StatusError from '../src/utils/StatusError'

const prisma = new PrismaClient()

export const customer = {
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
    await db('orderProducts').del()
    await db('invoices').del()
    await db('orders').del()
    await db('cartProducts').del()
    await db('productParameters').del()
    await db('parameters').del()
    await db('groupProducts').del()
    await db('groups').del()
    await db('listProducts').del()
    await db('answerComments').del()
    await db('answers').del()
    await db('questions').del()
    await db('ratingComments').del()
    await db('ratings').del()
    await db('products').del()
    await db('brandSections').del()
    await db('vendors').del()
    await db('categories').del()
    await db('lists').del()
    await db('userAddresses').del()
    await db('users').del()
    await db('addresses').del()
  } catch (err) {
    console.error(err)
  }
}

export const populateUsers = async (api: supertest.SuperTest<supertest.Test>): Promise<void> => {
  try {
    await api
      .post('/api/users')
      .send(customer)

    await api
      .post('/api/users')
      .send(admin)

    await api
      .post('/api/users')
      .send(root)

    const roleIDs = await db<Role>('roles')
    const adminRole = roleIDs.find((r) => r.name === 'ADMIN')
    const rootRole = roleIDs.find((r) => r.name === 'ROOT')

    if (!adminRole || !rootRole) { throw new StatusError() }

    await db('users')
      .update('roleID', adminRole.roleID)
      .where('email', admin.email)

    await db('users')
      .update('roleID', rootRole.roleID)
      .where('email', root.email)
  } catch (err) {
    console.error(err)
  }
}

export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await db<User>('users')
    .first()
    .where('email', email)

  if (!user) throw new StatusError(404, 'Not Found')
  return user
}

export const usersInDB = async (): Promise<User[]> => {
  return await db<User>('users')
}

export const itemsInDB = async (): Promise<Item[]> => {
  const items = await prisma.item.findMany()
  await prisma.disconnect()
  return items
}

export const categoriesInDB = async (): Promise<Category[]> => {
  return await db<Category>('categories')
}

export const vendorsInDB = async (): Promise<Vendor[]> => {
  return await db<Vendor>('vendors')
}

export const rolesInDB = async (): Promise<Role[]> => {
  return await db<Role>('roles')
}

export const addressesInDB = async (): Promise<Address[]> => {
  return await db<Address>('addresses')
}

export const shippingMethodsInDB = async (): Promise<ShippingMethod[]> => {
  return await db<ShippingMethod>('shippingMethods')
}

export const addressTypesInDB = async (): Promise<AddressType[]> => {
  return await db<AddressType>('addressTypes')
}

export const loginAs: (role: string, api: supertest.SuperTest<supertest.Test>) => Promise<{token: string; userID: number}> =
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
  return { token, userID: res.body.userID }
}
