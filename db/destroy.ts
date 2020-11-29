import { db } from '../src/utils/db'
import logger from '../src/utils/logger'

db.destroy()
  .then((_) => null)
  .catch((err) => logger.error(err))
