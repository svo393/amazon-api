import { Router } from 'express'
import 'express-async-errors'
import categoriesRouter from './categories'
import productsRouter from './products'
import usersRouter from './users'
import vendorsRouter from './vendors'
import rolesRouter from './roles'
import shippingMethodsRouter from './shippingMethods'
import addressTypesRouter from './addressTypes'
import addressesRouter from './addresses'
import followersRouter from './followers'
import userAddressesRouter from './userAddresses'
import listsRouter from './lists'
import listProductsRouter from './listProducts'
import ratingsRouter from './ratings'

export default Router()
  .use('/categories', categoriesRouter)
  .use('/products', productsRouter)
  .use('/users', usersRouter)
  .use('/vendors', vendorsRouter)
  .use('/roles', rolesRouter)
  .use('/shipping-methods', shippingMethodsRouter)
  .use('/address-types', addressTypesRouter)
  .use('/addresses', addressesRouter)
  .use('/followers', followersRouter)
  .use('/user-addresses', userAddressesRouter)
  .use('/lists', listsRouter)
  .use('/list-products', listProductsRouter)
  .use('/ratings', ratingsRouter)
