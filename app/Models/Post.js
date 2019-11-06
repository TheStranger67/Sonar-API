'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use ('Model')
const PostFilter = use ('App/ModelFilters/PostFilter')

class Post extends Model {
  static boot () {
    super.boot ()
    this.addTrait ('@provider:Filterable', PostFilter)
  }

  user () {
    return this.belongsTo ('App/Models/User')
  }

  songs () {
    return this.hasMany ('App/Models/Song')
  }

  lyrics () {
    return this.hasMany ('App/Models/Lyric')
  }

  ratings () {
    return this.hasMany ('App/Models/Rating')
  }
}

module.exports = Post
