import Knex from 'knex'
import knexConfig from '../../db/knexfile'
import env from '../../src/utils/config'

export default Knex(knexConfig[env.NODE_ENV as keyof typeof knexConfig])
