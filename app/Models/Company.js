'use strict'

const Model = use('Model')
const Hash = use ('Hash')

class Company extends Model {
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

  ads () {
    return this.hasMany ('App/Models/Ad')
  }
}

module.exports = Company
