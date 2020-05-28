import { Router } from 'express'
import 'express-async-errors'
import addressesRouter from './addresses'
import addressTypesRouter from './addressTypes'
import categoriesRouter from './categories'
import listsRouter from './lists'
import productsRouter from './products'
import ratingsRouter from './ratings'
import rolesRouter from './roles'
import shippingMethodsRouter from './shippingMethods'
import userAddressesRouter from './userAddresses'
import usersRouter from './users'
import vendorsRouter from './vendors'

export default Router()
  .use('/categories', categoriesRouter)
  .use('/products', productsRouter)
  .use('/users', usersRouter)
  .use('/vendors', vendorsRouter)
  .use('/roles', rolesRouter)
  .use('/shipping-methods', shippingMethodsRouter)
  .use('/address-types', addressTypesRouter)
  .use('/addresses', addressesRouter)
  .use('/user-addresses', userAddressesRouter)
  .use('/lists', listsRouter)
  .use('/ratings', ratingsRouter)
