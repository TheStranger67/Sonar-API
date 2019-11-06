'use strict'

const User = use ('App/Models/User')

class UserController {
  async store ({ request, response }) {
    const data = request.only ([
      'name',
      'email',
      'password',
      'cpf',
      'gender',
      'birth',
      'phone'
    ])
  
    await User.create (data)

    return response
      .status (200)
      .json ({message: 'Cadastro efetuado com sucesso!'})
  }

  async show ({ params, auth, response }) {
    const user = await User.findOrFail (params.id)

    const posts = await user.posts ()
      .with ('user', builder => {
        builder.select ('id', 'name')
      })
      .with ('songs')
      .with ('lyrics')
      .fetch ();

    return posts;
  }

  async update ({ params, request, auth, response }) {
    const data = request.only ([
      'name',
      'email',
      'password',
      'phone'
    ])

    const user = await User.findOrFail (params.id)

    if (user.id !== auth.user.id) {
      return response
        .status (401)
        .json ({ message: 'Acesso negado' })
    }

    user.merge (data)
    await user.save ()
    return response
      .status (200)
      .json ({ message: 'Perfil editado com sucesso!' })
  }

  async destroy ({ params, auth, response }) {
    const user = await User.findOrFail (params.id)

    if (user.id !== auth.user.id) {
      return response
        .status (401)
        .send ({ message: 'Acesso negado' })
    }

    user.delete ()

    return response
      .status (200)
      .send ()
  }
}

module.exports = UserController
