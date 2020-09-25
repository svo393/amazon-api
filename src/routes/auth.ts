import Router from 'express'
import authService from '../services/authService'
import { checkNewUser, checkUserLogin, checkUserPasswordUpdate, checkUserResetRequest, checkUserResetToken, checkUserUpdate } from '../utils/inputValidator'
import { requireAdmin, requireAuth, requireSameUser } from '../utils/middleware'
import StatusError from '../utils/StatusError'

const router = Router()

router.post('/', async (req, res) => {
  const userSignupInput = checkNewUser(req)
  const addedUser = await authService.signupUser(userSignupInput, req)
  res.status(201).json(addedUser)
})

router.post('/login', async (req, res) => {
  const userLoginInput = checkUserLogin(req)
  const loggedInUser = await authService.loginUser(userLoginInput, req)
  res.json(loggedInUser)
})

router.post('/admin/login', async (req, res) => {
  const userLoginInput = checkUserLogin(req)
  const loggedInUser = await authService.loginUser(userLoginInput, req, true)
  res.json(loggedInUser)
})

router.post('/logout', requireAuth, (req, res) => {
  req.session !== undefined && req.session.destroy((err) => {
    if (err) throw new StatusError(400, 'There was a problem logging out')
  })
  res.json(null)
})

router.put('/:userID', requireSameUser('params'), async (req, res) => {
  const userUpdateInput = checkUserUpdate(req)
  const updatedUser = await authService.updateProfile(userUpdateInput, req)
  res.json(updatedUser)
})

router.put('/:userID/password', requireSameUser('params'), async (req, res) => {
  const userPasswordUpdateInput = checkUserPasswordUpdate(req)
  const updatedUser = await authService.updatePassword(userPasswordUpdateInput, req)
  res.json(updatedUser)
})

// router.get('/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() })
// })

router.get('/check-in', async (req, res) => {
  const user = await authService.checkInUser(req)
  res.json(user)
})

router.get('/admin/check-in', requireAdmin, async (req, res) => {
  const user = await authService.checkInUser(req)
  res.json(user)
})

router.post('/request-password-reset', async (req, res) => {
  const userResetRequestInput = checkUserResetRequest(req)
  await authService.sendPasswordReset(userResetRequestInput)
  res.status(204).end()
})

router.post('/reset-password', async (req, res) => {
  const userPasswordResetInput = checkUserResetToken(req)
  const updatedUser = await authService.resetPassword(userPasswordResetInput)
  res.json(updatedUser)
})

router.delete('/:userID', requireSameUser('params'), async (req, res) => {
  await authService.deleteUser(req)
  res.json(null)
})

export default router
