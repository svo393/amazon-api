import Router from 'express'
import addressService from '../services/addressService'
import followerService from '../services/followerService'
import listService from '../services/listService'
import questionService from '../services/questionService'
import ratingService from '../services/ratingService'
import userAddressService from '../services/userAddressService'
import userService from '../services/userService'
import inputValidator from '../utils/inputValidator'
import { isAdmin, isLoggedIn, isSameUser, isSameUserOrAdmin } from '../utils/middleware'

const router = Router()

router.post('/', async (req, res) => {
  const userSignupInput = inputValidator.checkNewUser(req)
  const addedUser = await userService.addUser(userSignupInput, res)
  res.status(201).json(addedUser)
})

router.post('/login', async (req, res) => {
  const userLoginInput = inputValidator.checkUserLogin(req)
  const loggedInUser = await userService.loginUser(userLoginInput, res)
  res.json(loggedInUser)
})

router.post('/logout', (_req, res) => {
  res.clearCookie('token')
  res.status(204).end()
})

router.get('/', isAdmin, async (_req, res) => {
  const users = await userService.getUsers()
  res.json(users)
})

router.get('/me', isLoggedIn, async (req, res) => {
  const user = await userService.getUserByID(req, res)
  res.json(user)
})

router.get('/:userID', async (req, res) => {
  const user = await userService.getUserByID(req, res)
  res.json(user)
})

router.put('/:userID', isSameUser('params'), async (req, res) => {
  const userUpdateInput = inputValidator.checkUserUpdate(req)
  const updatedUser = await userService.updateUser(userUpdateInput, res, req)
  res.json(updatedUser)
})

router.delete('/:userID', isSameUser('params'), async (req, res) => {
  await userService.deleteUser(req, res)
  res.clearCookie('token')
  res.status(204).end()
})

router.post('/request-password-reset', async (req, res) => {
  const userResetRequestInput = inputValidator.checkUserResetRequest(req)
  await userService.sendPasswordReset(userResetRequestInput)
  res.status(204).end()
})

router.post('/reset-password', async (req, res) => {
  const userPasswordResetInput = inputValidator.checkUserResetToken(req)
  const updatedUser = await userService.resetPassword(userPasswordResetInput, res)
  res.json(updatedUser)
})

router.get('/:userID/addresses', isSameUserOrAdmin('params'), async (req, res) => {
  const addresses = await addressService.getAddressesByUser(req)
  res.json(addresses)
})

router.put('/:userID/addresses/:addressID/', isSameUser('params'), async (req, res) => {
  const userAddressUpdateInput = inputValidator.checkUserAddressesUpdate(req)
  const userAddresses = await userAddressService.updateUserAddress(userAddressUpdateInput, req)
  res.json(userAddresses)
})

router.delete('/:userID/addresses/:addressID/', isSameUser('params'), async (req, res) => {
  await userAddressService.deleteUserAddress(req)
  res.status(204).end()
})

router.get('/:userID/lists', isSameUserOrAdmin('params'), async (req, res) => {
  const lists = await listService.getListsByUser(req)
  res.json(lists)
})

router.get('/:userID/ratings', async (req, res) => {
  const ratings = await ratingService.getRatingsByUser(req)
  res.json(ratings)
})

router.get('/:userID/questions', async (req, res) => {
  const questions = await questionService.getQuestionsByUser(req)
  res.json(questions)
})

router.post('/:userID/follows/:anotherUserID', isSameUser('params'), async (req, res) => {
  const addedFollower = await followerService.addFollower(req)
  res.status(201).json(addedFollower)
})

router.get('/:userID/followers', async (req, res) => {
  const followeres = await followerService.getFollowersByUser(req)
  res.json(followeres)
})

router.get('/:userID/follows', async (req, res) => {
  const followeres = await followerService.getFollowedByUser(req)
  res.json(followeres)
})

router.delete('/:userID/follows/:anotherUserID', isSameUser('params'), async (req, res) => {
  await followerService.deleteFollower(req)
  res.status(204).end()
})

// router.get('/:userID/feed', async (req, res) => { // TODO all ratings, answers...

// })

export default router
