import { PrismaClient, User, Item } from '@prisma/client'

const prisma = new PrismaClient()

export const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

export const nonExistingID = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.remove()

  return note._id.toString()
}

export const itemsInDB = async (): Promise<Item[]> => {
  const items = await prisma.item.findMany()
  return items
}

export const usersInDB = async (): Promise<User[]> => {
  const users = await prisma.user.findMany()
  return users
}
