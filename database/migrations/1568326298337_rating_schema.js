'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use ('Schema')

class RatingSchema extends Schema {
  up () {
    this.create ('ratings', (table) => {
      table.increments ()
      table
        .integer ('user_id')
        .unsigned ()
        .references ('id')
        .inTable ('users')
        .onUpdate ('CASCADE')
        .onDelete ('CASCADE')
      table
        .integer ('post_id')
        .unsigned ()
        .references ('id')
        .inTable ('posts')
        .onUpdate ('CASCADE')
        .onDelete ('CASCADE')
      table.float ('value').unsigned ().notNullable ()
      table.string ('comment', 1024)
      table.timestamps ()
    })
  }

  down () {
    this.drop ('ratings')
  }
}

module.exports = RatingSchema
