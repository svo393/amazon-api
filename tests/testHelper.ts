import { PrismaClient, User, UserCreateInput } from '@prisma/client'

const prisma = new PrismaClient()

export const initialUsers = [
  {
    email: 'jack1@example.com',
    password: '12345678'
  },
  {
    email: 'jack2@example.com',
    password: '12345679'
  },
  {
    email: 'jack3@example.com',
    password: '12345679'
  }
]

export const populateUsers = (): void => {
  initialUsers.map(async (u: UserCreateInput) => {
    try {
      await prisma.user.create({ data: u })
      prisma.disconnect()
    } catch (error) {
      console.log(error)
    }
  })
}

export const usersInDB = async (): Promise<User[]> => {
  const users = await prisma.user.findMany()
  prisma.disconnect()
  return users
}
