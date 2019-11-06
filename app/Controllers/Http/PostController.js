'use strict'

const Post = use ('App/Models/Post')
const Drive = use ('Drive')
const { validate } = use('Validator')
const uuidv4 = require ('uuid/v4');

class PostController {
  async index ({ request }) {
    const { page = 1, order } = request.get ()
    const perPage = 6;

    const query = Post.query ()
      .with ('user', builder => {
        builder.select ('id', 'name')
      })
      .with ('songs')
      .with ('lyrics')
      .with ('ratings')
      .filter (request.all ())
    
    if (order === 'ratings') query.orderBy ('average_rating', 'desc')
    if (order === 'old') query.orderBy ('created_at')
    if (!order) query.orderBy ('created_at', 'desc')

    const posts = await query.paginate (page, perPage)

    return posts
  }

  async store ({ request, auth, response }) {
    const { id : user_id } = auth.user
    let data = {}
    let songExists = false
    let lyricExists = false

    await request.multipart.field (async (name, value) => {
      data = {...data, [name]: value}
    })

    request.multipart.file ('song_file', {
      types: ['audio']
    }, async file => {
      if (file) {
        const file_url = await Drive
          .disk ('s3')
          .put (`${uuidv4 ()}.${file.extname}`, file.stream)

        data = {
          ...data,
          song_path: file_url.split ('/')[3],
          song_filename: file.clientName
        }
        songExists = true;
      }
    })

    request.multipart.file ('lyrics_file', {
      types: ['text']
    }, async file => {
      if (file) {
        const file_url = await Drive
          .disk ('s3')
          .put (`${uuidv4 ()}.${file.extname}`, file.stream)
  
        data = {
          ...data,
          lyrics_path: file_url.split ('/')[3],
          lyrics_filename: file.clientName
        }
        lyricExists = true;
      }
    })
    await request.multipart.process ()

    const rules = {
      desc: 'required|max:2048',
    }
    
    const messages = {
      'desc.required': 'Não é possível enviar uma publicação vazia',
      'desc.max': 'A descrição deve ter menos de 2048 caracteres',
    }

    const validation = await validate (data, rules, messages)

    if (validation.fails ()) {
      return validation.messages ()
    }

    const post = await Post.create ({user_id, desc: data.desc})

    if (songExists)
      await post.songs ().create ({
        name: data.song_name,
        genre: data.song_genre,
        path: data.song_path,
        filename: data.song_filename
      })

    if (lyricExists)
      await post.lyrics ().create ({
        name: data.lyrics_name,
        genre: data.lyrics_genre,
        path: data.lyrics_path,
        filename: data.lyrics_filename
      })

    return response
      .status (200)
      .json ({message: 'Ideia compartilhada com sucesso!'})
  }

  async show ({ params }) {
    const post = await Post.findOrFail (params.id)

    await post.loadMany ({
      user: builder => builder.select ('id', 'name'),
      songs: null,
      lyrics: null,
      ratings: builder => builder.select ('id', 'user_id', 'value'),
    })
    return post;
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
    const post = await Post.findOrFail (params.id)

    if (post.user_id !== auth.user.id) {
      return response
        .status (401)
        .send ({ message: 'Acesso negado' })
    }

    post.delete ()

    return response
      .status (200)
      .send ()
  }
}

module.exports = PostController
