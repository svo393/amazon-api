import dotenv from 'dotenv'
import { pickAll } from 'ramda'

dotenv.config()

type Config = {
  PORT: string;
  REDIS_PASS: string;
  SESSION_SECRET: string;
  SESSION_MAX_AGE: string;
  STATIC_FILES_ENABLED: boolean;
  NODE_ENV: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;
  DB_HOST_DEV: string;
  DB_NAME_DEV: string;
  DB_USER_DEV: string;
  DB_PASS_DEV: string;
  DB_HOST_PROD: string;
  DB_NAME_PROD: string;
  DB_USER_PROD: string;
  DB_PASS_PROD: string;
  BASE_URLS: (string | undefined)[];
}

const envVars: Config = pickAll([
  'PORT',
  'REDIS_PASS',
  'SESSION_SECRET',
  'SESSION_MAX_AGE',
  'STATIC_FILES_ENABLED',
  'NODE_ENV',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASS',
  'DB_HOST_DEV',
  'DB_NAME_DEV',
  'DB_USER_DEV',
  'DB_PASS_DEV',
  'DB_HOST_PROD',
  'DB_NAME_PROD',
  'DB_USER_PROD',
  'DB_PASS_PROD'
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
