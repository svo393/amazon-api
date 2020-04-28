import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import env from './utils/config'
import { errorHandler, getUserID, unknownEndpoint } from './utils/middleware'

require('express-async-errors')
// import itemsRouter from './routes/items' // eslint-disable-line
import usersRouter from './routes/users' // eslint-disable-line

const app = express()
app.use(helmet())

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))

app.use(cookieParser())
app.use(getUserID)
app.use(express.json())
env.NODE_ENV === 'development' && app.use(logger('dev'))

// app.use('/api/items', itemsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
