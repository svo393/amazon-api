import Router from 'express'
import addressService from '../services/addressService'
import cartProductService from '../services/cartProductService'
import feedService from '../services/feedService'
import followerService from '../services/followerService'
import invoiceService from '../services/invoiceService'
import listService from '../services/listService'
import orderService from '../services/orderService'
import questionService from '../services/questionService'
import userAddressService from '../services/userAddressService'
import userService from '../services/userService'
import { UPLOAD_TIMEOUT } from '../utils/config'
import {
  checkCartProduct,
  checkCartProductDelete,
  checkFollows,
  checkLocalCart,
  checkNewOrder,
  checkSingleMediaUpload,
  checkUserAddressesUpdate,
  checkUserFeedFilters,
  checkUserFilters,
  checkUserRoleUpdate
} from '../utils/typeGuard'
import {
  multerUpload,
  requireAdmin,
  requireRoot,
  requireSameUser,
  requireSameUserOrAdmin
} from '../utils/middleware'

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

router.put('/:userID', requireRoot, async (req, res) => {
  const userRoleUpdateInput = checkUserRoleUpdate(req)
  const updatedUser = await userService.updateUserRole(
    userRoleUpdateInput,
    req
  )
  res.json(updatedUser)
})

router.post(
  '/:userID/upload-avatar',
  requireSameUser('params'),
  multerUpload.single('userAvatar'),
  async (req, res) => {
    req.socket.setTimeout(UPLOAD_TIMEOUT)
    const userMedia = checkSingleMediaUpload(req)
    await userService.uploadUserAvatar(userMedia, req)
    res.status(204).end()
  }
)

router.post(
  '/:userID/upload-cover',
  requireSameUser('params'),
  multerUpload.single('userCover'),
  async (req, res) => {
    req.socket.setTimeout(UPLOAD_TIMEOUT)
    const userMedia = checkSingleMediaUpload(req)
    await userService.uploadUserCover(userMedia, req)
    res.status(204).end()
  }
)

router.get(
  '/:userID/addresses',
  requireSameUserOrAdmin('params'),
  async (req, res) => {
    const addresses = await addressService.getAddressesByUser(req)
    res.json(addresses)
  }
)

router.put(
  '/:userID/addresses/:addressID/',
  requireSameUser('params'),
  async (req, res) => {
    const userAddressUpdateInput = checkUserAddressesUpdate(req)
    const userAddresses = await userAddressService.updateUserAddress(
      userAddressUpdateInput,
      req
    )
    res.json(userAddresses)
  }
)

router.delete(
  '/:userID/addresses/:addressID/',
  requireSameUser('params'),
  async (req, res) => {
    await userAddressService.deleteUserAddress(req)
    res.status(204).end()
  }
)

router.get(
  '/:userID/lists',
  requireSameUserOrAdmin('params'),
  async (req, res) => {
    const lists = await listService.getListsByUser(req)
    res.json(lists)
  }
)

router.get('/:userID/questions', async (req, res) => {
  const questions = await questionService.getQuestionsByUser(req)
  res.json(questions)
})

router.post(
  '/:userID/follows/:anotherUserID',
  requireSameUser('params'),
  async (req, res) => {
    const addedFollower = await followerService.addFollower(req)
    res.status(201).json(addedFollower)
  }
)

router.get('/:userID/followers', async (req, res) => {
  const followeres = await followerService.getFollowersByUser(req)
  res.json(followeres)
})

router.get('/:userID/follows', async (req, res) => {
  const followsInput = checkFollows(req)
  const follows = await followerService.getFollowedByUser(
    followsInput,
    req
  )
  res.json(follows)
})

router.get('/:userID/follows-feed', async (req, res) => {
  const followsFeedInput = checkUserFeedFilters(req)
  const followsFeed = await feedService.getFollowsFeed(
    followsFeedInput,
    req
  )
  res.json(followsFeed)
})

router.delete(
  '/:userID/follows/:anotherUserID',
  requireSameUser('params'),
  async (req, res) => {
    const deletedFollower = await followerService.deleteFollower(req)
    res.json(deletedFollower)
  }
)

router.post(
  '/:userID/cartProducts/:productID',
  requireSameUserOrAdmin('params'),
  async (req, res) => {
    const cartProductCreateInput = checkCartProduct(req)
    const addedCartProduct = await cartProductService.addCartProduct(
      cartProductCreateInput,
      req
    )
    res.status(201).json(addedCartProduct)
  }
)

router.post(
  '/:userID/cartProducts',
  requireSameUserOrAdmin('params'),
  async (req, res) => {
    const localCartProductInput = checkLocalCart(req)
    const cartProducts = await cartProductService.getCartProductsByUser(
      localCartProductInput,
      req
    )
    res.json(cartProducts)
  }
)

router.get(
  '/:userID/cartProducts/:productID',
  requireSameUserOrAdmin('params'),
  async (req, res) => {
    const cartProduct = await cartProductService.getCartProductByID(
      req
    )
    res.json(cartProduct)
  }
)

router.put(
  '/:userID/cartProducts/:productID',
  requireSameUserOrAdmin('params'),
  async (req, res) => {
    const cartProductUpdateInput = checkCartProduct(req)
    const updatedCartProduct = await cartProductService.updateCartProduct(
      cartProductUpdateInput,
      req
    )
    res.json(updatedCartProduct)
  }
)

router.delete(
  '/:userID/cartProducts/:productID',
  requireSameUserOrAdmin('params'),
  async (req, res) => {
    const cartProductDeleteInput = checkCartProductDelete(req)
    const deletedCartProduct = await cartProductService.deleteCartProduct(
      cartProductDeleteInput,
      req
    )
    res.json(deletedCartProduct)
  }
)

router.get(
  '/:userID/invoices',
  requireSameUserOrAdmin('params'),
  async (req, res) => {
    const invoices = await invoiceService.getInvoicesByUser(req)
    res.json(invoices)
  }
)

router.get('/:userID/feed', async (req, res) => {
  const userFeedFiltersInput = checkUserFeedFilters(req)
  const userFeed = await feedService.getUserFeed(
    userFeedFiltersInput,
    req
  )
  res.json(userFeed)
})

router.post(
  '/:userID/orders',
  requireSameUser('params'),
  async (req, res) => {
    const orderCreateInput = checkNewOrder(req)
    const addedOrder = await orderService.addOrder(
      orderCreateInput,
      req
    )
    res.status(201).json(addedOrder)
  }
)

export default router
