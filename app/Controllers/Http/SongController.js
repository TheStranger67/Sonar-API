'use strict'

const Song = use ('App/Models/Song')
const Helpers = use ('Helpers')
const Drive = use ('Drive')
const uuidv4 = require ('uuid/v4');

class SongController {
  async show ({ params, response }) {
    const song = await Song.findOrFail (params.id)
    const file = await Drive.disk ('s3').getObject (song.path)

    await Drive
      .disk ('local')
      .put (Helpers.tmpPath (song.path), Buffer.from (file.Body))

    response.attachment (Helpers.tmpPath (song.path), song.filename)
  }

  async update ({ params, request, auth, response }) {
    const song = await Song.findOrFail (params.id)
    const post = await song.post ().fetch ()

    if (post.user_id !== auth.user.id) {
      return response
        .status (401)
        .json ({ message: 'Acesso negado' })
    }

    let song_data = {}

    await request.multipart.field (async (name, value) => {
      song_data = {
        ...song_data,
        [name.split ('_')[1]]: value
      }
    })

    await request.multipart.file ('song_file', {
      types: ['audio']
    }, async file => {
      if (file) {
        await Drive.disk ('s3').delete (song.path)

        const file_url = await Drive
          .disk ('s3')
          .put (`${uuidv4 ()}.${file.extname}`, file.stream)

        song_data = {
          ...song_data,
          path: file_url.split ('/')[3],
          filename: file.clientName
        }
      }
    })
    await request.multipart.process ()

    song.merge (song_data)
    await song.save ()
    return response.status (200).send ()
  }

  async destroy ({ params, auth, response }) {
    const song = await Song.findOrFail (params.id)
    const post = await song.post ().fetch ()

    if (post.user_id !== auth.user.id) {
      return response
        .status (401)
        .json ({ message: 'Acesso negado' })
    }

    await Drive.disk ('s3').delete (song.path)
    song.delete ()

    return response
      .status (200)
      .send ()
  }
}

module.exports = SongController
