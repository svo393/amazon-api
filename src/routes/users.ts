import { PrismaClient } from '@prisma/client'
import Router, { Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from '../utils/validator'

const router = Router()
const prisma = new PrismaClient()

router.post('/', async (req, res): Promise<Response | void> => {
  const { email, password, name } = validator.toNewUser(req.body)

  if (password.length < 8) {
    return res.status(422).send('Password must be at least 8 characters')
  }

  const existingUser = await prisma.user.findOne({
    where: { email },
    select: { id: true }
  })

  if (existingUser) {
    return res.status(409).send(`User with email ${email} already exists`)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const addedUser = await prisma.user.create({
    data: { email, password: passwordHash, name },
    select: {
      avatar: true,
      email: true,
      id: true,
      name: true,
      cart: true
    }
  })

  const token = jwt.sign(
    { userID: addedUser.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  )

  prisma.disconnect()
  res.status(201).json({ user: { ...addedUser }, token })
})

router.get('/', async (_req, res) => {
  const users = await prisma.user.findMany()
  prisma.disconnect()
  res.send(users)
})

router.get('/:id', async (req, res) => {
  const user = await prisma.user.findOne({
    where: { id: req.params.id }
  })

  prisma.disconnect()

  user
    ? res.send(user)
    : res.sendStatus(404)
})

router.all('*', (req, res) => {
  res.status(405).send(`Method ${req.method} is not allowed`)
})

export default router
