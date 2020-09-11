import Knex from 'knex'

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('orderProducts', (t) => {
      t.dropPrimary()
      t.primary([ 'orderID', 'productID', 'size' ])
    })

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('orderProducts', (t) => {
      t.dropPrimary()
      t.primary([ 'orderID', 'productID' ])
    })
