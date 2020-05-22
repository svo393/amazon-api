import Router from 'express'
import userService from '../services/userService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  const userSignupInput = inputValidator.checkNewUser(req.body)
  const addedUser = await userService.addUser(userSignupInput, res)
  res.status(201).json(addedUser)
})

router.post('/login', async (req, res) => {
  const userLoginInput = inputValidator.checkUserLogin(req.body)
  const loggedInUser = await userService.loginUser(userLoginInput, res)
  res.json(loggedInUser)
})

router.post('/logout', (_req, res) => {
  res.clearCookie('token')
  res.sendStatus(204)
})

router.get('/', async (_req, res) => {
  await shield.isAdmin(res)
  const users = await userService.getUsers()
  res.json(users)
})

// router.get('/me', async (_req, res) => {
//   shield.isLoggedIn(res)
//   const user = await userService.getUserByID(res.locals.userID, res)
//   res.json(user)
// })

router.get('/:userID', async (req, res) => {
  const user = await userService.getUserByID(req.params.userID, res)
  res.json(user)
})

// router.put('/:id', async (req, res) => {
//   await shield.isSameUser(req, res)
//   const userInput = inputValidator.checkUserUpdate(req.body)
//   const updatedUser = await userService.updateUser(userInput, req.params.id)
//   res.json(updatedUser)
// })

// router.post('/request-password-reset', async (req, res) => {
//   const userInput = inputValidator.checkUserResetRequest(req.body)
//   await userService.sendPasswordReset(userInput)
//   res.sendStatus(204)
// })

// router.post('/reset-password', async (req, res) => {
//   const userInput = inputValidator.checkUserResetToken(req.body)
//   const updatedUser = await userService.resetPassword(userInput, res)
//   res.json(updatedUser)
// })

export default router
