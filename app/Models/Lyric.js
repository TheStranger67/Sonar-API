'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use ('Model')

class Lyric extends Model {
  post () {
    return this.belongsTo ('App/Models/Post')
  }
}

module.exports = Lyric
