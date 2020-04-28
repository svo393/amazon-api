import { PrismaClient, User } from '@prisma/client'
import userService from '../src/services/userService'
import StatusError from '../src/utils/StatusError'

const prisma = new PrismaClient()

export const user = {
  email: 'user@example.com',
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

export const populateUsers = async (): Promise<void> => {
  try {
    await prisma.user.deleteMany({})
    await userService.addUser(user)

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
