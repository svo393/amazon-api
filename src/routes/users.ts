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
  shield.isAdmin(res)
  const users = await userService.getUsers()
  res.json(users)
})

router.get('/me', async (_req, res) => {
  shield.isLoggedIn(res)
  const user = await userService.getUserByID(res.locals.userID, res)
  res.json(user)
})

router.get('/:userID', async (req, res) => {
  const user = await userService.getUserByID(req.params.userID, res)
  res.json(user)
})

router.put('/:userID', async (req, res) => {
  shield.isSameUser(req, res)
  const userUpdateInput = inputValidator.checkUserUpdate(req.body)
  const updatedUser = await userService.updateUser(userUpdateInput, res, req.params.userID)
  res.json(updatedUser)
})

router.post('/request-password-reset', async (req, res) => {
  const userResetRequestInput = inputValidator.checkUserResetRequest(req.body)
  await userService.sendPasswordReset(userResetRequestInput)
  res.sendStatus(204)
})

router.post('/reset-password', async (req, res) => {
  const userPasswordResetInput = inputValidator.checkUserResetToken(req.body)
  const updatedUser = await userService.resetPassword(userPasswordResetInput, res)
  res.json(updatedUser)
})

export default router
