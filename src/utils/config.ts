import * as dotenv from 'dotenv'

dotenv.config()

const {
  PORT,
  MONGODB_URI,
  TEST_MONGODB_URI,
  NODE_ENV,
  JWT_SECRET
} = process.env

const DB_URI = NODE_ENV === 'test'
  ? TEST_MONGODB_URI
  : MONGODB_URI

export { PORT, DB_URI, JWT_SECRET, NODE_ENV }
