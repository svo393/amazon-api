import { Router } from 'express'
import 'express-async-errors'
import { apiURLs } from '../utils/constants'
import addressesRouter from './addresses'
import addressTypesRouter from './addressTypes'
import answerCommentsRouter from './answerComments'
import answersRouter from './answers'
import categoriesRouter from './categories'
import groupsRouter from './groups'
import invoiceStatusesRouter from './invoiceStatuses'
import listsRouter from './lists'
import orderStatusesRouter from './orderStatuses'
import parametersRouter from './parameters'
import paymentMethodsRouter from './paymentMethods'
import productsRouter from './products'
import questionsRouter from './questions'
import ratingCommentsRouter from './ratingComments'
import ratingsRouter from './ratings'
import rolesRouter from './roles'
import shippingMethodsRouter from './shippingMethods'
import userAddressesRouter from './userAddresses'
import usersRouter from './users'
import vendorsRouter from './vendors'
import ordersRouter from './orders'

export default Router()
  .use(apiURLs.categories, categoriesRouter)
  .use(apiURLs.orders, ordersRouter)
  .use(apiURLs.products, productsRouter)
  .use(apiURLs.users, usersRouter)
  .use(apiURLs.vendors, vendorsRouter)
  .use(apiURLs.groups, groupsRouter)
  .use(apiURLs.parameters, parametersRouter)
  .use(apiURLs.roles, rolesRouter)
  .use(apiURLs.orderStatuses, orderStatusesRouter)
  .use(apiURLs.invoiceStatuses, invoiceStatusesRouter)
  .use(apiURLs.shippingMethods, shippingMethodsRouter)
  .use(apiURLs.addressTypes, addressTypesRouter)
  .use(apiURLs.paymentMethods, paymentMethodsRouter)
  .use(apiURLs.addresses, addressesRouter)
  .use(apiURLs.userAddresses, userAddressesRouter)
  .use(apiURLs.lists, listsRouter)
  .use(apiURLs.ratings, ratingsRouter)
  .use(apiURLs.questions, questionsRouter)
  .use(apiURLs.ratingComments, ratingCommentsRouter)
  .use(apiURLs.answers, answersRouter)
  .use(apiURLs.answerComments, answerCommentsRouter)
