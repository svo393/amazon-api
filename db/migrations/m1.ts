import Knex from 'knex'

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('cartProducts', (t) => {
      t.string('size', 50).notNullable()
    })

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('cartProducts', (t) => {
      t.dropColumn('size')
    })
