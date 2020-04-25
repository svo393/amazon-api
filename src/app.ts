import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { errorHandler, unknownEndpoint } from './utils/middleware'

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
app.use(express.json())

// app.use('/api/items', itemsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
