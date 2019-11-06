'use strict'

const Schema = use ('Schema')

class UserSchema extends Schema {
  up () {
    this.create ('users', (table) => {
      table.increments ()
      table.string ('name', 64).notNullable ().unique ()
      table.string ('email', 128).notNullable ().unique ()
      table.string ('password', 64).notNullable ()
      table.string ('cpf', 11).notNullable ().unique ()
      table.string ('gender', 1).notNullable ()
      table.date ('birth').notNullable ()
      table.string ('phone', 11).notNullable ()
      table
        .integer ('level')
        .unsigned ()
        .notNullable ()
        .defaultTo (4268)
      table.timestamps ()
    })
  }

  down () {
    this.drop ('users')
  }
}

module.exports = UserSchema
