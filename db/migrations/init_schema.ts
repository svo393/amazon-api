import Knex from 'knex'

// TODO indexes
export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .createTable('roles', (t) => {
      t.string('roleName', 50).primary()
    })

    .createTable('moderationStatuses', (t) => {
      t.string('moderationStatusName', 50).primary()
    })

    .createTable('shippingMethods', (t) => {
      t.string('shippingMethodName', 50).primary()
      t.boolean('isPrivate').defaultTo(false).notNullable()
    })

    .createTable('paymentMethods', (t) => {
      t.string('paymentMethodName', 50).primary()
    })

    .createTable('addressTypes', (t) => {
      t.string('addressTypeName', 50).primary()
      t.boolean('isPrivate').defaultTo(false).notNullable()
    })

    .createTable('addresses', (t) => {
      t.increments('addressID')
      t.string('country').notNullable()
      t.string('fullName').notNullable()
      t.string('streetAddressLine1').notNullable()
      t.string('streetAddressLine2')
      t.string('city').notNullable()
      t.string('region')
      t.integer('postalCode').notNullable()
      t.string('phoneNumber').notNullable()

      t
        .string('addressType')
        .references('addressTypes.addressTypeName')
        .notNullable()
    })

    .createTable('users', (t) => {
      t.increments('userID')
      t.string('name', 50).notNullable()
      t.string('info', 65535)
      t.string('email').unique().notNullable()
      t.string('password').notNullable()
      t.boolean('avatar').defaultTo(false).notNullable()
      t.boolean('cover').defaultTo(false).notNullable()
      t.dateTime('createdAt').notNullable()
      t.string('resetToken', 50)
      t.dateTime('resetTokenCreatedAt')

      t
        .string('role')
        .references('roles.roleName')
        .notNullable()
    })

    .createTable('followers', (t) => {
      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('follows')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')
    })
    .alterTable('followers', (t) => {
      t.primary([ 'userID', 'follows' ])
    })

    .createTable('userAddresses', (t) => {
      t.boolean('isDefault').defaultTo(true).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

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
        .onDelete('CASCADE')
    })
    .alterTable('lists', (t) => {
      t.unique([ 'userID', 'name' ])
    })

    .createTable('categories', (t) => {
      t.increments('categoryID')
      t.string('name', 50).unique().notNullable()

      t
        .integer('parentCategoryID')
        .references('categories.categoryID')
        .onDelete('SET NULL')
    })

    .createTable('vendors', (t) => {
      t.increments('vendorID')
      t.string('name', 50).unique().notNullable()
    })

    .createTable('groups', (t) => {
      t.increments('groupID')
    })

    .createTable('products', (t) => {
      t.increments('productID')
      t.string('title').notNullable()
      t.integer('listPrice').unsigned()
      t.integer('price').notNullable().unsigned()
      t.string('bullets', 65535).notNullable()
      t.string('description', 65535)
      t.integer('stock').unsigned()
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.boolean('isAvailable').defaultTo(true).notNullable()

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
        .integer('groupID')
        .references('groups.groupID')
        .notNullable()
    })

    .createTable('productSizes', (t) => {
      t.string('name', 50).notNullable()
      t.integer('qty').unsigned().notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
        .onDelete('CASCADE')
    })
    .alterTable('productSizes', (t) => {
      t.primary([ 'name', 'productID' ])
    })

    .createTable('listProducts', (t) => {
      t
        .integer('listID')
        .references('lists.listID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })
    .alterTable('listProducts', (t) => {
      t.primary([ 'listID', 'productID' ])
    })

    .createTable('reviews', (t) => {
      t.increments('reviewID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('title').notNullable()
      t.string('content', 65535).notNullable()
      t.integer('stars').notNullable().unsigned()
      t.boolean('isVerified').defaultTo(false).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('groupID')
        .references('groups.groupID')
        .notNullable()

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()

      t
        .string('moderationStatus')
        .references('moderationStatuses.moderationStatusName')
        .defaultTo('NEW')
    })
    .alterTable('reviews', (t) => {
      t.unique([ 'userID', 'groupID' ])
    })

    .createTable('reviewComments', (t) => {
      t.increments('reviewCommentID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('content', 65535).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('reviewID')
        .references('reviews.reviewID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('parentReviewCommentID')
        .references('reviewComments.reviewCommentID')
        .onDelete('SET NULL')

      t
        .string('moderationStatus')
        .references('moderationStatuses.moderationStatusName')
        .defaultTo('NEW')
    })

    .createTable('questions', (t) => {
      t.increments('questionID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('content', 65535).unique().notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('groupID')
        .references('groups.groupID')
        .notNullable()

      t
        .string('moderationStatus')
        .references('moderationStatuses.moderationStatusName')
        .defaultTo('NEW')
    })

    .createTable('answers', (t) => {
      t.increments('answerID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.string('content', 65535).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('questionID')
        .references('questions.questionID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .string('moderationStatus')
        .references('moderationStatuses.moderationStatusName')
        .defaultTo('NEW')
    })

    .createTable('votes', (t) => {
      t.increments('voteID')
      t.boolean('vote').notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('reviewID')
        .references('reviews.reviewID')
        .onDelete('CASCADE')

      t
        .integer('questionID')
        .references('questions.questionID')
        .onDelete('CASCADE')

      t
        .integer('answerID')
        .references('answers.answerID')
        .onDelete('CASCADE')
    })
    .alterTable('votes', (t) => {
      t.unique([ 'reviewID', 'userID' ])
    })
    .alterTable('votes', (t) => {
      t.unique([ 'questionID', 'userID' ])
    })
    .alterTable('votes', (t) => {
      t.unique([ 'answerID', 'userID' ])
    })

    .createTable('images', (t) => {
      t.increments('imageID')
      t.integer('index').unsigned().notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('productID')
        .references('products.productID')
        .onDelete('CASCADE')

      t
        .integer('reviewID')
        .references('reviews.reviewID')
        .onDelete('CASCADE')
    })
    .alterTable('images', (t) => {
      t.unique([ 'productID', 'index' ])
    })
    .alterTable('images', (t) => {
      t.unique([ 'reviewID', 'index' ])
    })

    .createTable('groupVariations', (t) => {
      t.string('name', 50).notNullable()
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
    .alterTable('groupVariations', (t) => {
      t.primary([ 'groupID', 'productID', 'name' ])
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
        .onDelete('CASCADE')

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
      t.string('size', 50).notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .notNullable()
        .onDelete('CASCADE')

      t
        .integer('productID')
        .references('products.productID')
        .notNullable()
    })
    .alterTable('cartProducts', (t) => {
      t.primary([ 'userID', 'productID', 'size' ])
    })

    .createTable('orderStatuses', (t) => {
      t.string('orderStatusName', 50).primary()
    })

    .createTable('orders', (t) => {
      t.increments('orderID')
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.dateTime('shippedAt')
      t.jsonb('address').notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .onDelete('SET NULL')

      t
        .string('orderStatus')
        .references('orderStatuses.orderStatusName')
        .defaultTo('NEW')

      t
        .string('shippingMethod')
        .references('shippingMethods.shippingMethodName')
        .notNullable()
    })

    .createTable('orderProducts', (t) => {
      t.integer('price').notNullable().unsigned()
      t.integer('qty').notNullable().unsigned()
      t.string('size', 50).notNullable()

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
      t.primary([ 'orderID', 'productID', 'size' ])
    })

    .createTable('invoiceStatuses', (t) => {
      t.string('invoiceStatusName', 50).primary()
    })

    .createTable('invoices', (t) => {
      t.increments('invoiceID')
      t.integer('amount').notNullable().unsigned()
      t.string('details', 65535).notNullable()
      t.dateTime('createdAt').notNullable()
      t.dateTime('updatedAt').notNullable()
      t.integer('shippingCost').notNullable()

      t
        .integer('userID')
        .references('users.userID')
        .onDelete('SET NULL')

      t
        .integer('orderID')
        .references('orders.orderID')
        .notNullable()

      t
        .string('invoiceStatus')
        .references('invoiceStatuses.invoiceStatusName')
        .defaultTo('NEW')

      t
        .string('paymentMethod')
        .references('paymentMethods.paymentMethodName')
        .notNullable()
    })

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema
    .dropTableIfExists('invoices')
    .dropTableIfExists('invoiceStatuses')
    .dropTableIfExists('orderProducts')
    .dropTableIfExists('orders')
    .dropTableIfExists('orderStatuses')
    .dropTableIfExists('cartProducts')
    .dropTableIfExists('productParameters')
    .dropTableIfExists('parameters')
    .dropTableIfExists('groupVariations')
    .dropTableIfExists('images')
    .dropTableIfExists('votes')
    .dropTableIfExists('answers')
    .dropTableIfExists('questions')
    .dropTableIfExists('reviewComments')
    .dropTableIfExists('reviews')
    .dropTableIfExists('listProducts')
    .dropTableIfExists('productSizes')
    .dropTableIfExists('products')
    .dropTableIfExists('groups')
    .dropTableIfExists('vendors')
    .dropTableIfExists('categories')
    .dropTableIfExists('lists')
    .dropTableIfExists('userAddresses')
    .dropTableIfExists('followers')
    .dropTableIfExists('users')
    .dropTableIfExists('addresses')
    .dropTableIfExists('paymentMethods')
    .dropTableIfExists('addressTypes')
    .dropTableIfExists('shippingMethods')
    .dropTableIfExists('moderationStatuses')
    .dropTableIfExists('roles')
