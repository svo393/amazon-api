import Router from 'express'
import userService from '../services/userService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

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
  shield.isLoggedIn(res)
  res.clearCookie('token')
  res.status(302).json({ location: '/login' })
})

router.get('/', async (_req, res) => {
  await shield.isRoot(res)
  const users = await userService.getUsers()
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await userService.getUserByID(req.params.id, res)
  res.json(user)
})

router.put('/:id', async (req, res) => {
  shield.isSameUser(req, res)
  const userInput = inputValidator.checkUserUpdate(req.body)
  const updatedUser = await userService.updateUser(userInput, req.params.id)
  res.json(updatedUser)
})

export default router
