import { Router } from 'express'
import 'express-async-errors'
import addressesRouter from './addresses'
import addressTypesRouter from './addressTypes'
import categoriesRouter from './categories'
import listsRouter from './lists'
import productsRouter from './products'
import ratingsRouter from './ratings'
import ratingCommentsRouter from './ratingComments'
import rolesRouter from './roles'
import shippingMethodsRouter from './shippingMethods'
import userAddressesRouter from './userAddresses'
import usersRouter from './users'
import vendorsRouter from './vendors'
import { apiURLs } from '../utils/constants'

export default Router()
  .use(apiURLs.categories, categoriesRouter)
  .use(apiURLs.products, productsRouter)
  .use(apiURLs.users, usersRouter)
  .use(apiURLs.vendors, vendorsRouter)
  .use(apiURLs.roles, rolesRouter)
  .use(apiURLs.shippingMethods, shippingMethodsRouter)
  .use(apiURLs.addressTypes, addressTypesRouter)
  .use(apiURLs.addresses, addressesRouter)
  .use(apiURLs.userAddresses, userAddressesRouter)
  .use(apiURLs.lists, listsRouter)
  .use(apiURLs.ratings, ratingsRouter)
  .use(apiURLs.ratingComments, ratingCommentsRouter)
