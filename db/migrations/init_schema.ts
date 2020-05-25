import Knex from 'knex'

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .createTable('roles', (t) => {
      t.increments('roleID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('shippingMethods', (t) => {
      t.increments('shippingMethodID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('addressTypes', (t) => {
      t.increments('addressTypeID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('addresses', (t) => {
      t.increments('addressID')
      t.string('addr').notNullable()

      t
        .integer('addressTypeID')
        .references('addressTypes.addressTypeID')
        .notNullable()
    })
    .alterTable('addresses', (t) => {
      t.unique([ 'addr', 'addressTypeID' ])
    })

    .createTable('users', (t) => {
      t.increments('userID')
      t.string('name', 50)
      t.string('info')
      t.string('email').unique().notNullable()
      t.string('password').notNullable()
      t.boolean('avatar').defaultTo(false).notNullable()
      t.dateTime('createdAt').notNullable()
      t.string('resetToken', 50)
      t.dateTime('resetTokenCreatedAt')
      t.boolean('isDeleted').defaultTo(false).notNullable()

      t
        .integer('roleID')
        .references('roles.roleID')
        .notNullable()
    })

    .createTable('followers', (t) => {
      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('follows')
        .references('users.userID')
        .notNullable()
    })
    .alterTable('followers', (t) => {
      t.primary([ 'userID', 'follows' ])
    })

    .createTable('userAddresses', (t) => {
      t.boolean('isDefault').defaultTo(false).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('addressID')
        .references('addresses.addressID')
        .notNullable()
    })
    .alterTable('userAddresses', (t) => {
      t.primary([ 'userID', 'addressID' ])
    })

    .createTable('lists', (t) => {
      t.increments('listID')
      t.string('name', 50).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
    })
    .alterTable('lists', (t) => {
      t.unique([ 'userID', 'listID' ])
    })

    .createTable('categories', (t) => {
      t.increments('categoryID')
      t.string('name', 50).unique().notNullable()

      t
        .integer('parentCategoryID')
        .references('categories.categoryID')
    })

    .createTable('vendors', (t) => {
      t.increments('vendorID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('brandSections', (t) => {
      t.increments('brandSectionID')
      t.string('content', 65535).notNullable()
    })

    .createTable('products', (t) => {
      t.increments('productID')
      t.string('title').notNullable()
      t.integer('listPrice').notNullable().unsigned()
      t.integer('price').notNullable().unsigned()
      t.string('description', 65535).notNullable()
      t.integer('stock').notNullable().unsigned()
      t.integer('media').notNullable().unsigned()
      t.integer('primaryMedia').notNullable().unsigned()
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.boolean('isAvailable').defaultTo(true).notNullable()
      t.boolean('isDeleted').defaultTo(false).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('categoryID')
        .references('categories.categoryID')
        .notNullable()

      t
        .integer('vendorID')
        .references('vendors.vendorID')
        .notNullable()

      t
        .integer('brandSectionID')
        .references('brandSections.brandSectionID')
    })

    .createTable('ratings', (t) => {
      t.increments('ratingID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('title')
      t.string('review', 65535)
      t.integer('media').unsigned()
      t.integer('stars').notNullable().unsigned()
      t.integer('likes').notNullable().unsigned().defaultTo(0)
      t.integer('dislikes').notNullable().unsigned().defaultTo(0)
      t.boolean('isVerified').defaultTo(false).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })
    .alterTable('ratings', (t) => {
      t.unique([ 'userID', 'productID' ])
    })

    .createTable('ratingComments', (t) => {
      t.increments('ratingCommentID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('content', 65535).notNullable()
      t.integer('media').unsigned()
      t.boolean('isVerified').defaultTo(false).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('ratingID')
        .references('ratings.ratingID')
        .notNullable()

      t
        .integer('parentRatingCommentID')
        .references('ratingComments.ratingCommentID')
    })

    .createTable('questions', (t) => {
      t.increments('questionID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('content', 65535).unique().notNullable()
      t.integer('media').unsigned()
      t.integer('likes').notNullable().unsigned().defaultTo(0)
      t.integer('dislikes').notNullable().unsigned().defaultTo(0)
      t.boolean('isVerified').defaultTo(false).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })

    .createTable('answers', (t) => {
      t.increments('answerID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('content', 65535).unique().notNullable()
      t.integer('media').unsigned()
      t.integer('likes').notNullable().unsigned().defaultTo(0)
      t.integer('dislikes').notNullable().unsigned().defaultTo(0)
      t.boolean('isVerified').defaultTo(false).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('questionID')
        .references('questions.questionID')
        .notNullable()
    })

    .createTable('answerComments', (t) => {
      t.increments('answerCommentID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('content', 65535).notNullable()
      t.integer('media').unsigned()
      t.boolean('isVerified').defaultTo(false).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('answerID')
        .references('answers.answerID')
        .notNullable()

      t
        .integer('parentAnswerCommentID')
        .references('answerComments.answerCommentID')
    })

    .createTable('listProducts', (t) => {
      t
        .integer('listID')
        .references('lists.listID')
        .notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })
    .alterTable('listProducts', (t) => {
      t.primary([ 'listID', 'productID' ])
    })

    .createTable('groups', (t) => {
      t.increments('groupID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('groupProducts', (t) => {
      t.string('value', 50).notNullable()

      t
        .integer('groupID')
        .references('groups.groupID')
        .notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })
    .alterTable('groupProducts', (t) => {
      t.primary([ 'groupID', 'productID' ])
    })

    .createTable('parameters', (t) => {
      t.increments('parameterID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('productParameters', (t) => {
      t.string('value', 50).notNullable()

      t
        .integer('parameterID')
        .references('parameters.parameterID')
        .notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })
    .alterTable('productParameters', (t) => {
      t.primary([ 'parameterID', 'productID' ])
    })

    .createTable('cartProducts', (t) => {
      t.integer('qty').notNullable().unsigned()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })
    .alterTable('cartProducts', (t) => {
      t.primary([ 'userID', 'productID' ])
    })

    .createTable('orderStatuses', (t) => {
      t.increments('orderStatusID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('orders', (t) => {
      t.increments('orderID')
      t.string('address').notNullable()
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()

      t
        .integer('orderStatusID')
        .references('orderStatuses.orderStatusID')
        .notNullable()

      t
        .integer('shippingMethodID')
        .references('shippingMethods.shippingMethodID')
        .notNullable()
    })

    .createTable('invoiceStatuses', (t) => {
      t.increments('invoiceStatusID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('invoices', (t) => {
      t.increments('invoiceID')
      t.integer('amount').notNullable().unsigned()
      t.dateTime('createdAt').notNullable()

      t
        .integer('orderID')
        .references('orders.orderID')
        .notNullable()

      t
        .integer('invoiceStatusID')
        .references('invoiceStatuses.invoiceStatusID')
        .notNullable()
    })

    .createTable('orderProducts', (t) => {
      t.integer('price').notNullable().unsigned()
      t.integer('qty').notNullable().unsigned()

      t
        .integer('orderID')
        .references('orders.orderID')
        .notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })
    .alterTable('orderProducts', (t) => {
      t.primary([ 'orderID', 'productID' ])
    })

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .dropTableIfExists('orderProducts')
    .dropTableIfExists('invoices')
    .dropTableIfExists('invoiceStatuses')
    .dropTableIfExists('orders')
    .dropTableIfExists('orderStatuses')
    .dropTableIfExists('cartProducts')
    .dropTableIfExists('productParameters')
    .dropTableIfExists('parameters')
    .dropTableIfExists('groupProducts')
    .dropTableIfExists('groups')
    .dropTableIfExists('listProducts')
    .dropTableIfExists('answerComments')
    .dropTableIfExists('answers')
    .dropTableIfExists('questions')
    .dropTableIfExists('ratingComments')
    .dropTableIfExists('ratings')
    .dropTableIfExists('products')
    .dropTableIfExists('brandSections')
    .dropTableIfExists('vendors')
    .dropTableIfExists('categories')
    .dropTableIfExists('lists')
    .dropTableIfExists('userAddresses')
    .dropTableIfExists('followers')
    .dropTableIfExists('users')
    .dropTableIfExists('addresses')
    .dropTableIfExists('shippingMethods')
    .dropTableIfExists('roles')
