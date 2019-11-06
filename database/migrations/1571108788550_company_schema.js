'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use ('Schema')

class CompanySchema extends Schema {
  up () {
    this.create ('companies', (table) => {
      table.increments ()
      table.string ('razsoc', 64).notNullable ().unique ()
      table.string ('name', 64).notNullable ()
      table.string ('email', 128).notNullable ().unique ()
      table.string ('password', 64).notNullable ()
      table.string ('cnpj', 14).notNullable ().unique ()
      table.string ('phone', 11).notNullable ()
      table
        .integer ('level')
        .unsigned ()
        .notNullable ()
        .defaultTo (9317)
      table.timestamps ()
    })
  }

  down () {
    this.drop ('companies')
  }
}

module.exports = CompanySchema
