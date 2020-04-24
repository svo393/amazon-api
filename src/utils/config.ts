import * as dotenv from 'dotenv'

dotenv.config()

const {
  PORT,
  JWT_SECRET
} = process.env

export { PORT, JWT_SECRET }
