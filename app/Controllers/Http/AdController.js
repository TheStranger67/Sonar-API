'use strict'

const Ad = use ('App/Models/Ad')

class AdController {
  async index ({ request }) {
    const { page = 1, order } = request.get ()
    const perPage = 6;

    const ads = await Ad.query ()
      .with ('company', builder => {
        builder.select ('id', 'razsoc', 'name', 'email', 'cnpj', 'phone')
      }).paginate (page, perPage)

    return ads
  }

  async store ({ request, auth, response }) {
    const { id : company_id } = auth.user
    let data = {}

    await request.multipart.field (async (name, value) => {
      data = {...data, [name]: value}
    })

    request.multipart.file ('banner', {
      types: ['image']
    }, async file => {
      if (file) {
        const file_url = await Drive
          .disk ('s3')
          .put (`${uuidv4 ()}.${file.extname}`, file.stream)

        data = {
          ...data,
          banner: file_url.split ('/')[3],
        }
      }
    })
    await request.multipart.process ()

    const rules = {
      title: 'required|max:128',
      desc: 'required|max:256',
    }
    
    const messages = {
      'title.required': 'Preencha o campo de título',
      'title.max': 'O título deve ter menos de 128 caracteres',
      'desc.required': 'Preencha o campo de descrição',
      'desc.max': 'A descrição deve ter menos de 256 caracteres',
    }

    const validation = await validate (data, rules, messages)

    if (validation.fails ())
      return validation.messages ()

    await Ad.create ({company_id, desc: data.desc})

    return response
      .status (200)
      .json ({message: 'Proposta enviada com sucesso!'})
  }

  async show ({ params }) {
    // const post = await Post.findOrFail (params.id)

    // await post.loadMany ({
    //   user: builder => builder.select ('id', 'name'),
    //   songs: null,
    //   lyrics: null,
    //   ratings: builder => builder.select ('id', 'user_id', 'value'),
    // })
    // return post;
  }

  async update ({ params, request, auth, response }) {
    const {
      description: desc,
      songName,
      songGenre,
      lyricsName,
      lyricsGenre
    } = request.all ()

    const post = await Post.findOrFail (params.id)

    if (post.user_id !== auth.user.id) {
      return response
        .status (401)
        .json ({ message: 'Acesso negado' })
    }

    post.merge ({ desc })

    await post
      .songs ()
      .where ('post_id', post.id)
      .update ({
        name: songName,
        genre: songGenre,
      })

    await post
      .lyrics ()
      .where ('post_id', post.id)
      .update ({
        name: lyricsName,
        genre: lyricsGenre,
      })
      
    await post.save ()

    return response
      .status (200)
      .json ({ message: 'Post editado com sucesso!' })
  }

  async destroy ({ params, auth, response }) {
    const ad = await Ad.findOrFail (params.id)

    if (ad.company_id !== auth.user.id || auth.user.level !== 9317) {
      return response
        .status (401)
        .send ({ message: 'Acesso negado' })
    }

    ad.delete ()

    return response
      .status (200)
      .send ()
  }
}

module.exports = AdController
