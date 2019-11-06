'use strict'

class StoreCompany {
  get rules () {
    return {
      razsoc: 'required|max:64|unique:companies,razsoc',
      name: 'required|max:64',
      email: 'required|email|max:64|unique:companies,email',
      password: 'required|min:8|max:16|confirmed',
      cnpj: 'required|cnpj|unique:companies,cnpj',
      phone: 'required|min:10|max:11',
    }
  }

  get messages () {
    return {
      'razsoc.required': 'Preencha o campo de razão social',
      'razsoc.unique': 'A razão social inserida já foi cadastrada',
      'razsoc.max': 'A razão social deve ter menos de 64 caractéres',

      'name.required': 'Preencha o campo de nome do responsável',
      'name.max': 'O nome do responsável deve ter menos de 64 caractéres',

      'email.required': 'Preencha o campo de e-mail',
      'email.unique': 'O e-mail inserido já foi cadastrado',
      'email.email': 'Insira um e-mail válido',
      'email.max': 'O e-mail deve ter menos de 64 caractéres',

      'password.required': 'Preencha o campo de senha',
      'password.confirmed': 'As senhas devem ser iguais',
      'password.min': 'A senha deve ter entre 8 e 16 caractéres',
      'password.max': 'A senha deve ter entre 8 e 16 caractéres',

      'cnpj.required': 'Preencha o campo de CNPJ',
      'cnpj.unique': 'O CNPJ inserido já foi cadastrado',
      'cnpj.cnpj': 'Insira um CNPJ válido',

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

module.exports = StoreCompany
