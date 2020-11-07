// import redisStore from 'connect-redis'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// import csrf from 'csurf'
import cuid from 'cuid'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import logger from 'morgan'
// import path from 'path'
// import redis from 'redis'
import router from './routes'
import env from './utils/config'
import { errorHandler, unknownEndpoint } from './utils/middleware'
import fileStore from 'session-file-store'
import StatusError from './utils/StatusError'

const FileStore = fileStore(session)

// const RedisStore = redisStore(session)
// const redisClient = redis.createClient({ password: env.REDIS_PASS })

// redisClient.on('error', (err) => {
//   console.error('Redis error: ', err)
// })

// const csrfProtection = csrf({ cookie: true })

const app = express()
app.use(helmet())

// TODO consider enabling cache

app.use(cors({
  credentials: true,
  allowedHeaders: 'Set-Cookie',
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (!env.BASE_URLS.includes(origin)) {
      return callback(new StatusError(401, 'CORS error'), false)
    }
    return callback(null, true)
  },
  optionsSuccessStatus: 200
}))

// app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.json())
app.use(cookieParser())

app.use(session({
  genid: () => cuid(),
  store: new FileStore({}),

  // store: new RedisStore({
  //   host: 'localhost',
  //   port: 6379,
  //   client: redisClient

  // }),

  name: 'sessionID',
  secret: env.SESSION_SECRET,
  saveUninitialized: false,
  // saveUninitialized: true,
  resave: false,
  rolling: true,
  cookie: {
    httpOnly: false,
    maxAge: parseInt(env.SESSION_MAX_AGE)
    // sameSite: 'none',
    // path: 'https://admin.rolloven.net/',
    // domain: 'admin.rolloven.net'
  }
}))

env.NODE_ENV === 'development' && app.use(logger('dev'))

// app.use(csrfProtection)

app.use('/', router)
app.use(unknownEndpoint)
app.use(errorHandler)

export default app
