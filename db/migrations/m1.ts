import Knex from 'knex'

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('cartProducts', (t) => {
      t.string('size', 50)
    })

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('cartProducts', (t) => {
      t.dropColumn('size')
    })
