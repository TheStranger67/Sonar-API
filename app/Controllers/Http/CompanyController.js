'use strict'

const Company = use ('App/Models/Company')

class CompanyController {
  async index ({ request, response, view }) {
  }

  async store ({ request, response }) {
    const data = request.only ([
      'razsoc',
      'name',
      'email',
      'password',
      'cnpj',
      'phone'
    ])
  
    await Company.create (data)

    return response
      .status (200)
      .json ({message: 'Cadastro efetuado com sucesso!'})
  }

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = CompanyController
