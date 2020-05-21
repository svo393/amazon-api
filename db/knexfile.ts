const config = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'knex',
      password: '12345678',
      database: 'amazon-api'
    }
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
      user: 'mosh',
      password: '123456',
      database: 'sql_store'
    }
  }
}

module.exports = config

export default config