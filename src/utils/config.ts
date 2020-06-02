import dotenv from 'dotenv'
import R from 'ramda'

dotenv.config()

type Config = {
  PORT: string;
  JWT_SECRET: string;
  NODE_ENV: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;
  BASE_URL?: string;
}

const envVars: Config = R.pickAll([
  'PORT',
  'JWT_SECRET',
  'NODE_ENV',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASS'
], process.env)

envVars.BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.PROD_URL
  : process.env.DEV_URL

export const UPLOAD_TIMEOUT = 10000

if (R.any(R.isNil)(R.values(envVars))) {
  console.error('Missing environment variables. Shutting down...')
  process.exit(1)
}

export default envVars
