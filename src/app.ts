import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import itemRouter from './routes/items'
import { unknownEndpoint } from './utils/middleware'

const app = express()
app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/api/items', itemRouter)
app.use(unknownEndpoint)

export default app
