import dotenv from 'dotenv'
import R from 'ramda'

dotenv.config()

type Config = {
  PORT: string;
  JWT_SECRET: string;
  NODE_ENV: string;
}

const envVars = R.pickAll([
  'PORT',
  'JWT_SECRET',
  'NODE_ENV'
], process.env)

if (R.any(R.isNil)(R.values(envVars))) {
  console.error('Missing environment variables. Shutting down...')
  process.exit(1)
}

export default envVars as Config
