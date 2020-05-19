import Knex from 'knex'

const roles = [ 'ROOT', 'ADMIN', 'CUSTOMER' ]
const statuses = [ 'NEW', 'PROCESSING', 'DONE', 'CANCELLED' ]

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .createTable('users', (t) => {
      t.string('id').primary()
      t.string('name')
      t.string('email').unique().notNullable()
      t.string('password').notNullable()
      t.boolean('avatar').defaultTo(false)
      t.timestamp('created_at').defaultTo(knex.fn.now())
      t.string('reset_token')
      t.string('reset_token_expiry')
      t.enu('role', roles).defaultTo('CUSTOMER')
    })

    .createTable('items', (t) => {
      t.string('id').primary()
      t.string('name').notNullable()
      t.integer('list_price').notNullable()
      t.integer('price').notNullable()
      t.string('description').notNullable()
      t.integer('stock').notNullable()
      t.integer('stars').defaultTo(0)
      t.integer('media').notNullable()
      t.integer('primary_media').notNullable()
      t.timestamps()
      t.boolean('is_available').defaultTo(true)

      t
        .string('user_id')
        .references('users.id')
        .notNullable()
    })

    .createTable('orders', (t) => {
      t.string('id').primary()
      t.enu('status', statuses).defaultTo('NEW')
      t.timestamps()

      t
        .string('user_id')
        .references('users.id')
        .notNullable()
    })

    .createTable('invoices', (t) => {
      t.string('id').primary()
      t.integer('amount').notNullable()
      t.timestamp('created_at').defaultTo(knex.fn.now())

      t
        .string('order_id')
        .references('orders.id')
        .notNullable()
    })

    .createTable('order_items', (t) => {
      t.integer('price').notNullable()
      t.integer('qty').notNullable()

      t
        .string('order_id')
        .references('orders.id')
        .notNullable()

      t
        .string('item_id')
        .references('items.id')
        .notNullable()
    })
    .alterTable('order_items', (t) => {
      t.unique([ 'order_id', 'item_id' ])
    })

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .dropTableIfExists('order_items')
    .dropTableIfExists('invoices')
    .dropTableIfExists('orders')
    .dropTableIfExists('items')
    .dropTableIfExists('users')
