const config = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'knex',
      password: '12345678',
      database: 'amazon-api'
    },
    pool: { min: 0, max: 30 } // TODO what is optimum
  },
  production: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'knex',
      password: '12345678',
      database: 'amazon-api'
    }
  },
  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'knex',
      password: '12345678',
      database: 'amazon-api'
    }
  }
}

module.exports = config

export default config
