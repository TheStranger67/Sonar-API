'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdSchema extends Schema {
  up () {
    this.create('ads', (table) => {
      table.increments ()
      table
        .integer ('company_id')
        .unsigned ()
        .references ('id')
        .inTable ('company')
        .onUpdate ('CASCADE')
        .onDelete ('CASCADE')
      table.string ('title', 128).notNullable ()
      table.string ('desc', 256).notNullable ()
      table.string ('banner', 128).notNullable ()
      table.boolean ('active').notNullable ().defaultTo (false)
      table.timestamps ()
    })
  }

  down () {
    this.drop ('ads')
  }
}

module.exports = AdSchema
