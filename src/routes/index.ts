import { Router } from 'express'
import 'express-async-errors'
import categoriesRouter from './categories'
import productsRouter from './products'
import usersRouter from './users'
import vendorsRouter from './vendors'

export default Router()
  .use('/categories', categoriesRouter)
  .use('/products', productsRouter)
  .use('/users', usersRouter)
  .use('/vendors', vendorsRouter)
