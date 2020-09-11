import Knex from 'knex'

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('cartProducts', (t) => {
      t.dropPrimary()
      t.primary([ 'userID', 'productID', 'size' ])
    })

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('cartProducts', (t) => {
      t.dropPrimary()
      t.primary([ 'userID', 'productID' ])
    })
