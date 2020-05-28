import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import router from './routes'
import env from './utils/config'
import { errorHandler, getUserID, unknownEndpoint } from './utils/middleware'

const app = express()
app.use(helmet())

app.use(cors({
  credentials: true,
  origin: env.BASE_URL,
  optionsSuccessStatus: 200
}))

app.use(cookieParser())
app.use(getUserID)
app.use(express.json())
env.NODE_ENV === 'development' && app.use(logger('dev'))

app.use('/', router)
app.use(unknownEndpoint)
app.use(errorHandler)

export default app
