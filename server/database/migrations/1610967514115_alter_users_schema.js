'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.foreign('user_type_id').references('user_types.id').onDelete('cascade')
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterUsersSchema
