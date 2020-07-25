import dotenv from 'dotenv'
import R from 'ramda'

dotenv.config()

type Config = {
  PORT: string;
  REDIS_PASS: string;
  SESSION_SECRET: string;
  SESSION_MAX_AGE: string;
  NODE_ENV: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;
  BASE_URLS: (string | undefined)[];
}

const envVars: Config = R.pickAll([
  'PORT',
  'REDIS_PASS',
  'SESSION_SECRET',
  'SESSION_MAX_AGE',
  'NODE_ENV',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASS'
], process.env)

envVars.BASE_URLS = process.env.NODE_ENV === 'production'
  ? [ process.env.PROD_URL1, process.env.PROD_URL2 ]
  : [ process.env.DEV_URL1, process.env.DEV_URL2 ]

export const UPLOAD_TIMEOUT = 20000

if (Object.values(envVars).some((v) => v === undefined)) {
  console.error('Missing environment variables. Shutting down...')
  process.exit(1)
}

export default envVars
