import { Router } from 'express'
import 'express-async-errors'
import categoriesRouter from './categories'
import itemsRouter from './items'
import usersRouter from './users'
import vendorsRouter from './vendors'

export default Router()
  .use('/categories', categoriesRouter)
  .use('/items', itemsRouter)
  .use('/users', usersRouter)
  .use('/vendors', vendorsRouter)
