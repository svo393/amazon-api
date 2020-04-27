import Router from 'express'
import userService from '../services/userService'
import inputValidator from '../utils/inputValidator'
import { checkUserID } from '../utils/validatorLib'

const router = Router()

router.post('/', async (req, res) => {
  const userInput = inputValidator.checkNewUser(req.body)
  const addedUser = await userService.addUser(userInput)

  res.cookie('token', addedUser.token, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax'
  })

  delete addedUser.token
  res.status(201).json(addedUser)
})

router.post('/login', async (req, res) => {
  const userInput = inputValidator.checkUserLogin(req.body)
  const loggedInUser = await userService.loginUser(userInput)

  res.cookie('token', loggedInUser.token, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax'
  })

  delete loggedInUser.token
  res.json(loggedInUser)
})

router.post('/logout', (_req, res) => {
  checkUserID(res.locals.userID)
  res.clearCookie('token')
  res.status(403).json({ error: 'Forbidden', location: '/login' })
})

router.get('/', async (_req, res) => {
  checkUserID(res.locals.userID)
  const users = await userService.getUsers()
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await userService.getUserByID(req.params.id)

  user
    ? res.json(user)
    : res.status(404).json({ error: 'Not Found' })
})

router.put('/:id', async (req, res) => {
  const userInput = inputValidator.checkUserUpdate(req.body)
  const updatedUser = await userService.updateUser(userInput, req.params.id)

  updatedUser
    ? res.json(updatedUser)
    : res.status(404).json({ error: 'Not Found' })
})

router.all('*', (req, res) => {
  res.status(405).json({ error: `Method ${req.method} is not allowed` })
})

export default router
