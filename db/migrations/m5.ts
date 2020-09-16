import Knex from 'knex'

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('users', (t) => {
      t.boolean('cover').defaultTo(false).notNullable()
    })

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .alterTable('users', (t) => {
      t.dropColumn('cover')
    })
