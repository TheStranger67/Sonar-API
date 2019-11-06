'use strict'

class UpdatePost {
  get rules () {
    return {
      description: 'required|max:2048',
    }
  }

  get messages () {
    return {
      'description.required': 'Não é possível enviar uma publicação vazia',
      'description.max': 'A descrição deve ter menos de 2048 caracteres',
    }
  }

  get validateAll () {
    return true
  }

  async fails (messages) {
    return this.ctx.response
      .status (400)
      .json (messages[0])
  }
}

module.exports = UpdatePost
