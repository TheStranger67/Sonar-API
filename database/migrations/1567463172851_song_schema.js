'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use ('Schema')

class SongSchema extends Schema {
  up () {
    this.create ('songs', (table) => {
      table.increments ()
      table
        .integer ('post_id')
        .unsigned ()
        .references ('id')
        .inTable ('posts')
        .onUpdate ('CASCADE')
        .onDelete ('CASCADE')
      table.string ('name', 128).notNullable ()
      table.string ('genre', 64).notNullable ()
      table.string ('path', 128).notNullable ()
      table.string ('filename', 128).notNullable ()
      table.timestamps ()
    })
  }

  down () {
    this.drop ('songs')
  }
}

module.exports = SongSchema
