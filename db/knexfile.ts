import env from '../src/utils/config'

const config = {
  development: {
    client: 'pg',
    connection: {
      host: env.DB_HOST_DEV,
      database: env.DB_NAME_DEV,
      user: env.DB_USER_DEV,
      password: env.DB_PASS_DEV
    },
    pool: { min: 0, max: 30 }
  },
  production: {
    client: 'pg',
    connection: {
      host: env.DB_HOST_PROD,
      database: env.DB_NAME_PROD,
      user: env.DB_USER_PROD,
      password: env.DB_PASS_PROD
    },
    pool: { min: 0, max: 30 }
  }
}

module.exports = config

export default config
