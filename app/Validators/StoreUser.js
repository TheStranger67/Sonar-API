'use strict'

class StoreUser {
  get rules () {
    return {
      name: 'required|max:64',
      email: 'required|email|max:64|unique:users,email',
      password: 'required|min:8|max:16|confirmed',
      cpf: 'required|cpf|unique:users,cpf',
      gender: 'required',
      birth: 'required|dateFormat:YYYY-MM-DD|before:2010-01-01|after:1900-01-01',
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

      'cpf.required': 'Preencha o campo de CPF',
      'cpf.unique': 'O CPF inserido já foi cadastrado',
      'cpf.cpf': 'Insira um CPF válido',

      'gender.required': 'Preencha o campo de sexo',

      'birth.required': 'Preencha o campo de data de nascimento',
      'birth.dateFormat': 'Insira uma data válida',
      'birth.before': 'Insira uma data entre 1900 e 2010',
      'birth.after': 'Insira uma data entre 1900 e 2010',

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
      .json (messages[0])
  }
}

module.exports = StoreUser
