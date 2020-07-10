import Router from 'express'
import addressService from '../services/addressService'
import cartProductService from '../services/cartProductService'
import followerService from '../services/followerService'
import invoiceService from '../services/invoiceService'
import listService from '../services/listService'
import orderService from '../services/orderService'
import questionService from '../services/questionService'
import userAddressService from '../services/userAddressService'
import userService from '../services/userService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import { checkCartProductUpdate, checkNewCartProduct, checkNewUser, checkSingleMediaUpload, checkUserAddressesUpdate, checkUserFilters, checkUserLogin, checkUserResetRequest, checkUserResetToken, checkUserUpdate } from '../utils/inputValidator'
import { isAdmin, isLoggedIn, isSameUser, isSameUserOrAdmin, multerUpload } from '../utils/middleware'

const router = Router()

router.post('/', async (req, res) => {
  const userSignupInput = checkNewUser(req)
  const addedUser = await userService.addUser(userSignupInput, res)
  res.status(201).json(addedUser)
})

router.post('/login', async (req, res) => {
  const userLoginInput = checkUserLogin(req)
  const loggedInUser = await userService.loginUser(userLoginInput, res)
  res.json(loggedInUser)
})

router.post('/logout', (_req, res) => {
  res.clearCookie('token')
  res.status(204).end()
})

router.get('/', isAdmin, async (req, res) => {
  const usersFiltersinput = checkUserFilters(req)
  const users = await userService.getUsers(usersFiltersinput)
  res.json(users)
})

router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

router.get('/me', isLoggedIn, async (req, res) => {
  const user = await userService.getMe(res)
  res.json(user)
})

router.get('/:userID', async (req, res) => {
  const user = await userService.getUserByID(req, res)
  res.json(user)
})

router.put('/:userID', isSameUser('params'), async (req, res) => {
  const userUpdateInput = checkUserUpdate(req)
  const updatedUser = await userService.updateUser(userUpdateInput, res, req)
  res.json(updatedUser)
})

router.delete('/:userID', isSameUser('params'), async (req, res) => {
  await userService.deleteUser(req, res)
  res.clearCookie('token')
  res.status(204).end()
})

router.post('/:userID/upload', isSameUser('params'), multerUpload.single('userAvatar'), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const userMedia = checkSingleMediaUpload(req)
  userService.uploadUserAvatar(userMedia, res)
  res.status(204).end()
})

router.post('/request-password-reset', async (req, res) => {
  const userResetRequestInput = checkUserResetRequest(req)
  await userService.sendPasswordReset(userResetRequestInput)
  res.status(204).end()
})

router.post('/reset-password', async (req, res) => {
  const userPasswordResetInput = checkUserResetToken(req)
  const updatedUser = await userService.resetPassword(userPasswordResetInput, res)
  res.json(updatedUser)
})

router.get('/:userID/addresses', isSameUserOrAdmin('params'), async (req, res) => {
  const addresses = await addressService.getAddressesByUser(req)
  res.json(addresses)
})

router.put('/:userID/addresses/:addressID/', isSameUser('params'), async (req, res) => {
  const userAddressUpdateInput = checkUserAddressesUpdate(req)
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

router.post('/:userID/cartProducts', isSameUserOrAdmin('params'), async (req, res) => {
  const cartProductCreateInput = checkNewCartProduct(req)
  const addedCartProduct = await cartProductService.addCartProduct(cartProductCreateInput)
  res.status(201).json(addedCartProduct)
})

router.get('/:userID/cartProducts', isSameUserOrAdmin('params'), async (req, res) => {
  const cartProducts = await cartProductService.getCartProductsByUser(req)
  res.json(cartProducts)
})

router.get('/:userID/cartProducts/:productID', isSameUserOrAdmin('params'), async (req, res) => {
  const cartProduct = await cartProductService.getCartProductByID(req)
  res.json(cartProduct)
})

router.put('/:userID/cartProducts/:productID', isSameUserOrAdmin('params'), async (req, res) => {
  const cartProductUpdateInput = checkCartProductUpdate(req)
  const updatedCartProduct = await cartProductService.updateCartProduct(cartProductUpdateInput, req)
  res.json(updatedCartProduct)
})

router.delete('/:userID/cartProducts/:productID', isSameUserOrAdmin('params'), async (req, res) => {
  await cartProductService.deleteCartProduct(req)
  res.status(204).end()
})

// TODO remove redundant routes
router.get('/:userID/orders', isSameUserOrAdmin('params'), async (req, res) => {
  const orders = await orderService.getOrdersByUser(req)
  res.json(orders)
})

router.get('/:userID/invoices', isSameUserOrAdmin('params'), async (req, res) => {
  const invoices = await invoiceService.getInvoicesByUser(req)
  res.json(invoices)
})

export default router
