import cors from 'cors'
import path from 'path'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import router from './routes'
import env from './utils/config'
import { errorHandler, unknownEndpoint } from './utils/middleware'
import csrf from 'csurf'
import session from 'express-session'

const csrfProtection = csrf({ cookie: true })

const app = express()
app.use(helmet())

// TODO consider enabling cache

app.use(express.static(path.join(process.cwd(), 'public'))) // TODO migrate to nginx
app.use(express.json())

app.use(session({
  secret: env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: parseInt(env.SESSION_MAX_AGE),
    sameSite: 'lax'
  }
}))

env.NODE_ENV === 'development' && app.use(logger('dev'))

app.use(cors({
  credentials: true,
  origin: env.BASE_URL,
  optionsSuccessStatus: 200
}))

// app.use(csrfProtection)

app.use('/', router)
app.use(unknownEndpoint)
app.use(errorHandler)

export default app
