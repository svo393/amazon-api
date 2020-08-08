import { Router } from 'express'
import 'express-async-errors'
import { apiURLs } from '../utils/constants'
import addressesRouter from './addresses'
import addressTypesRouter from './addressTypes'
import answerCommentsRouter from './answerComments'
import answersRouter from './answers'
import authRouter from './auth'
import categoriesRouter from './categories'
import feedRouter from './feed'
import groupsRouter from './groups'
import imagesRouter from './images'
import invoicesRouter from './invoices'
import invoiceStatusesRouter from './invoiceStatuses'
import listsRouter from './lists'
import moderationStatusesRouter from './moderationStatuses'
import ordersRouter from './orders'
import orderStatusesRouter from './orderStatuses'
import parametersRouter from './parameters'
import paymentMethodsRouter from './paymentMethods'
import productsRouter from './products'
import questionsRouter from './questions'
import reviewCommentsRouter from './reviewComments'
import reviewsRouter from './reviews'
import rolesRouter from './roles'
import shippingMethodsRouter from './shippingMethods'
import usersRouter from './users'
import vendorsRouter from './vendors'

export default Router()
  .use(apiURLs.addresses, addressesRouter)
  .use(apiURLs.addressTypes, addressTypesRouter)
  .use(apiURLs.answerComments, answerCommentsRouter)
  .use(apiURLs.answers, answersRouter)
  .use(apiURLs.auth, authRouter)
  .use(apiURLs.categories, categoriesRouter)
  .use(apiURLs.feed, feedRouter)
  .use(apiURLs.groups, groupsRouter)
  .use(apiURLs.images, imagesRouter)
  .use(apiURLs.invoices, invoicesRouter)
  .use(apiURLs.invoiceStatuses, invoiceStatusesRouter)
  .use(apiURLs.lists, listsRouter)
  .use(apiURLs.moderationStatuses, moderationStatusesRouter)
  .use(apiURLs.orders, ordersRouter)
  .use(apiURLs.orderStatuses, orderStatusesRouter)
  .use(apiURLs.parameters, parametersRouter)
  .use(apiURLs.paymentMethods, paymentMethodsRouter)
  .use(apiURLs.products, productsRouter)
  .use(apiURLs.questions, questionsRouter)
  .use(apiURLs.reviewComments, reviewCommentsRouter)
  .use(apiURLs.reviews, reviewsRouter)
  .use(apiURLs.roles, rolesRouter)
  .use(apiURLs.shippingMethods, shippingMethodsRouter)
  .use(apiURLs.users, usersRouter)
  .use(apiURLs.vendors, vendorsRouter)
