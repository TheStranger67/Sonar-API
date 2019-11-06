const { hooks } = require ('@adonisjs/ignitor')

hooks.before.httpServer (() => {
  const Validator = use ('Validator')
  const cpf = require ("@fnando/cpf/dist/node");
  const cnpj = require ("@fnando/cnpj/dist/node");

  Validator.extend ('cpf', async (data, message) => {
    if (!cpf.isValid (data.cpf))
      throw message
  })

  Validator.extend ('cnpj', async (data, message) => {
    if (!cnpj.isValid (data.cnpj))
      throw message
  })
})