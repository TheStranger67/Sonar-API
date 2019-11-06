'use strict'

class Login {
  get rules () {
    return {
      email: 'required|email',
      password: 'required'
    }
  }

  get messages () {
    return {
      'email.required': 'Preencha o campo de e-mail',
      'email.email': 'Insira um e-mail válido',
      'password.required': 'Preencha o campo de senha',
    }
  }

  async fails (messages) {
    return this.ctx.response
      .status (400)
      .json (messages[0])
  }
}

module.exports = Login
