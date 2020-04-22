import * as dotenv from 'dotenv'
import http from 'http'
import app from './app'
import logger from './utils/logger'

dotenv.config()

const server = http.createServer(app)

const PORT = process.env.PORT
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`))
