import Router from 'express'
import userService from '../services/userService'
import validator from '../utils/validator'

const router = Router()

router.post('/', async (req, res) => {
  const userInput = validator.authUserInput(req.body)
  const addedUser = await userService.addUser(userInput)
  res.status(201).json(addedUser)
})

router.get('/', async (_req, res) => {
  const users = await userService.getUsers()
  res.send(users)
})

router.get('/:id', async (req, res) => {
  const user = await userService.getUserByID(req.params.id)

  user
    ? res.send(user)
    : res.sendStatus(404)
})

router.post('/login', async (req, res) => {
  const userInput = validator.authUserInput(req.body)
  const loggedInUser = await userService.loginUser(userInput)
  res.status(200).json(loggedInUser)
})

router.all('*', (req, res) => {
  res.status(405).send(`Method ${req.method} is not allowed`)
})

export default router
