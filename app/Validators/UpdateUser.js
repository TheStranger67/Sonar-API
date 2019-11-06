'use strict'

class UpdateUser {
  get rules () {
    const userId = this.ctx.params.id

    return {
      name: `required|max:64`,
      email: `required|email|max:64|unique:users,email,id,${userId}`,
      password: 'required|min:8|max:16|confirmed',
      phone: 'required|min:10|max:11',
    }
  }

  get messages () {
    return {
      'name.required': 'Preencha o campo de nome',
      'name.max': 'O nome deve ter menos de 64 caractéres',

      'email.required': 'Preencha o campo de e-mail',
      'email.unique': 'O e-mail inserido já foi cadastrado',
      'email.email': 'Insira um e-mail válido',
      'email.max': 'O e-mail deve ter menos de 64 caractéres',

      'password.required': 'Preencha o campo de senha',
      'password.confirmed': 'As senhas devem ser iguais',
      'password.min': 'A senha deve ter entre 8 e 16 caractéres',
      'password.max': 'A senha deve ter entre 8 e 16 caractéres',

      'phone.required': 'Preencha o campo de telefone',
      'phone.min': 'Insira uma númro de telefone válido',
      'phone.max': 'Insira uma númro de telefone válido',
    }
  }

  get validateAll () {
    return true
  }

  async fails (messages) {
    return this.ctx.response
      .status (400)
      .json (messages)
  }
}

module.exports = UpdateUser
