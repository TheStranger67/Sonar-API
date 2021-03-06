'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use ('Model')
const Hash = use ('Hash')

class User extends Model {
  static boot () {
    super.boot ()

    this.addHook ('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make (userInstance.password)
      }
    })
  }

  tokens () {
    return this.hasMany ('App/Models/Token')
  }

  posts () {
    return this.hasMany ('App/Models/Post')
  }

  ratings () {
    return this.hasMany ('App/Models/Rating')
  }
}

module.exports = User
