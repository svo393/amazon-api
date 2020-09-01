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
import { checkCartProductUpdate, checkNewCartProduct, checkNewOrder, checkSingleMediaUpload, checkUserAddressesUpdate, checkUserFilters, checkUserUpdate, checkNewInvoice, checkLocalCart } from '../utils/inputValidator'
import { multerUpload, requireAdmin, requireSameUser, requireSameUserOrAdmin } from '../utils/middleware'

const router = Router()

router.get('/', requireAdmin, async (req, res) => {
  const usersFiltersinput = checkUserFilters(req)
  const users = await userService.getUsers(usersFiltersinput)
  res.json(users)
})

router.get('/:userID', async (req, res) => {
  const user = await userService.getUserByID(req)
  res.json(user)
})

router.put('/:userID', requireSameUser('params'), async (req, res) => {
  const userUpdateInput = checkUserUpdate(req)
  const updatedUser = await userService.updateUser(userUpdateInput, res, req)
  res.json(updatedUser)
})

router.post('/:userID/upload', requireSameUser('params'), multerUpload.single('userAvatar'), (req, res) => {
  req.socket.setTimeout(UPLOAD_TIMEOUT)
  const userMedia = checkSingleMediaUpload(req)
  userService.uploadUserAvatar(userMedia, req)
  res.status(204).end()
})

router.get('/:userID/addresses', requireSameUserOrAdmin('params'), async (req, res) => {
  const addresses = await addressService.getAddressesByUser(req)
  res.json(addresses)
})

router.put('/:userID/addresses/:addressID/', requireSameUser('params'), async (req, res) => {
  const userAddressUpdateInput = checkUserAddressesUpdate(req)
  const userAddresses = await userAddressService.updateUserAddress(userAddressUpdateInput, req)
  res.json(userAddresses)
})

router.delete('/:userID/addresses/:addressID/', requireSameUser('params'), async (req, res) => {
  await userAddressService.deleteUserAddress(req)
  res.status(204).end()
})

router.get('/:userID/lists', requireSameUserOrAdmin('params'), async (req, res) => {
  const lists = await listService.getListsByUser(req)
  res.json(lists)
})

router.get('/:userID/questions', async (req, res) => {
  const questions = await questionService.getQuestionsByUser(req)
  res.json(questions)
})

router.post('/:userID/follows/:anotherUserID', requireSameUser('params'), async (req, res) => {
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

router.delete('/:userID/follows/:anotherUserID', requireSameUser('params'), async (req, res) => {
  await followerService.deleteFollower(req)
  res.status(204).end()
})

router.post('/:userID/cartProducts/:productID', requireSameUserOrAdmin('params'), async (req, res) => {
  const cartProductCreateInput = checkNewCartProduct(req)
  const addedCartProduct = await cartProductService.addCartProduct(cartProductCreateInput, req)
  res.status(201).json(addedCartProduct)
})

router.post('/:userID/cartProducts', requireSameUserOrAdmin('params'), async (req, res) => {
  const localCartProductInput = checkLocalCart(req)
  const cartProducts = await cartProductService.getCartProductsByUser(localCartProductInput, req)
  res.json(cartProducts)
})

router.get('/:userID/cartProducts/:productID', requireSameUserOrAdmin('params'), async (req, res) => {
  const cartProduct = await cartProductService.getCartProductByID(req)
  res.json(cartProduct)
})

router.put('/:userID/cartProducts/:productID', requireSameUserOrAdmin('params'), async (req, res) => {
  const cartProductUpdateInput = checkCartProductUpdate(req)
  const updatedCartProduct = await cartProductService.updateCartProduct(cartProductUpdateInput, req)
  res.json(updatedCartProduct)
})

router.delete('/:userID/cartProducts/:productID', requireSameUserOrAdmin('params'), async (req, res) => {
  await cartProductService.deleteCartProduct(req)
  res.status(204).end()
})

// TODO remove redundant routes
router.get('/:userID/orders', requireSameUserOrAdmin('params'), async (req, res) => {
  const orders = await orderService.getOrdersByUser(req)
  res.json(orders)
})

router.get('/:userID/invoices', requireSameUserOrAdmin('params'), async (req, res) => {
  const invoices = await invoiceService.getInvoicesByUser(req)
  res.json(invoices)
})

router.post('/:userID/orders', requireSameUser('params'), async (req, res) => {
  const orderCreateInput = checkNewOrder(req)
  const addedOrder = await orderService.addOrder(orderCreateInput, req)
  res.status(201).json(addedOrder)
})

export default router
