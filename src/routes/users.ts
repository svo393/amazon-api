import Router from 'express'
import userService from '../services/userService'
import inputValidator from '../utils/inputValidator'

const router = Router()

router.post('/', async (req, res) => {
  const userInput = inputValidator.checkNewUser(req.body)
  const addedUser = await userService.addUser(userInput)
  res.status(201).json(addedUser)
})

router.post('/login', async (req, res) => {
  const userInput = inputValidator.checkUserLogin(req.body)
  const loggedInUser = await userService.loginUser(userInput)
  res.json(loggedInUser)
})

router.get('/', async (_req, res) => {
  const users = await userService.getUsers()
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await userService.getUserByID(req.params.id)

  user
    ? res.json(user)
    : res.sendStatus(404)
})

router.put('/:id', async (req, res) => {
  const userInput = inputValidator.checkUserUpdate(req.body)
  const updatedUser = await userService.updateUser(userInput, req.params.id)

  updatedUser
    ? res.json(updatedUser)
    : res.sendStatus(404)
})

router.all('*', (req, res) => {
  res.status(405).send(`Method ${req.method} is not allowed`)
})

export default router
