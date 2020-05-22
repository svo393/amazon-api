import Knex from 'knex'
import env from '../src/utils/config'
import { invoiceStatuses, orderStatuses, roles, shippingMethods } from '../src/utils/constants'
import knexConfig from './knexfile'

const knex = Knex(knexConfig[env.NODE_ENV as keyof typeof knexConfig])

const init = async (): Promise<void> => {
  await knex('roles').del()

  await knex('roles')
    .insert(roles.map((r) => ({ name: r })))

  await knex('shippingMethods').del()

  await knex('shippingMethods')
    .insert(shippingMethods.map((m) => ({ name: m })))

  await knex('orderStatuses').del()

  await knex('orderStatuses')
    .insert(orderStatuses.map((s) => ({ name: s })))

  await knex('invoiceStatuses').del()

  await knex('invoiceStatuses')
    .insert(invoiceStatuses.map((s) => ({ name: s })))

  process.exit(0) // TODO
}

init()
