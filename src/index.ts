import http from 'http'
import app from './app'
import env from './utils/config'
import logger from './utils/logger'

const server = http.createServer(app)

server.listen(env.PORT, () => logger.info(`Server running on port ${env.PORT}`))
