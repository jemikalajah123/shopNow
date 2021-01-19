'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.integer('user_type_id').unsigned().notNullable()
      // table.foreign('user_type_id').references('user_types.id').onDelete('cascade')
      table.string('name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('store_name', 80).unique()
      table.string('password', 60).notNullable()
      table.string('phone_no', 15).notNullable()
      table.string('address', 254).nullable()
      table.integer('total_order').defaultTo(0)
      table.boolean('can_sell').defaultTo(false)
      table.boolean('is_confirmed').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
