import Router from 'express'
import userService from '../services/userService'
import inputValidator from '../utils/inputValidator'
import { isAdmin, isLoggedIn, isSameUser } from '../utils/middleware'
import followerService from '../services/followerService'
import userAddressService from '../services/userAddressService'

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

router.get('/', isAdmin, async (_req, res) => {
  const users = await userService.getUsers()
  res.json(users)
})

router.get('/me', isLoggedIn, async (_req, res) => {
  const user = await userService.getUserByID(res.locals.userID, res)
  res.json(user)
})

router.get('/:userID', async (req, res) => {
  const user = await userService.getUserByID(Number(req.params.userID), res)
  res.json(user)
})

router.put('/:userID', isSameUser('params'), async (req, res) => {
  const userUpdateInput = inputValidator.checkUserUpdate(req.body)
  const updatedUser = await userService.updateUser(userUpdateInput, res, Number(req.params.userID))
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

router.delete('/:userID/followers/:follows', isSameUser('params'), async (req, res) => {
  await followerService.deleteFollower(Number(req.params.userID), Number(req.params.follows))
  res.status(204).end()
})

router.put('/:userID/addresses/:addressID/', isSameUser('params'), async (req, res) => {
  const userAddressUpdateInput = inputValidator.checkUserAddressesUpdate(req.body)
  const userAddresses = await userAddressService.updateUserAddress(userAddressUpdateInput, Number(req.params.addressID), Number(req.params.userID))
  res.json(userAddresses)
})

router.delete('/:userID/addresses/:addressID/', isSameUser('params'), async (req, res) => {
  await userAddressService.deleteUserAddress(Number(req.params.addressID), Number(req.params.userID))
  res.status(204).end()
})

export default router
