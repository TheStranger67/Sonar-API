'use strict'

const Lyric = use ('App/Models/Lyric')
const Helpers = use ('Helpers')
const Drive = use ('Drive')
const uuidv4 = require ('uuid/v4');

class LyricController {
  async show ({ params, response }) {
    const lyric = await Lyric.findOrFail (params.id)
    const file = await Drive.disk ('s3').getObject (lyric.path)

    await Drive
      .disk ('local')
      .put (Helpers.tmpPath (lyric.path), Buffer.from (file.Body))

    return response.attachment (Helpers.tmpPath (lyric.path), lyric.filename)
  }

  async update ({ params, request, auth, response }) {
    const lyric = await Lyric.findOrFail (params.id)
    const post = await lyric.post ().fetch ()

    if (post.user_id !== auth.user.id) {
      return response
        .status (401)
        .json ({ message: 'Acesso negado' })
    }

    let lyric_data = {}

    await request.multipart.field (async (name, value) => {
      lyric_data = {
        ...lyric_data,
        [name.split ('_')[1]]: value
      }
    })

    await request.multipart.file ('lyric_file', {
      types: ['audio']
    }, async file => {
      if (file) {
        await Drive.disk ('s3').delete (lyric.path)

        const file_url = await Drive
          .disk ('s3')
          .put (`${uuidv4 ()}.${file.extname}`, file.stream)

        lyric_data = {
          ...lyric_data,
          path: file_url.split ('/')[3],
          filename: file.clientName
        }
      }
    })
    await request.multipart.process ()

    lyric.merge (lyric_data)
    await lyric.save ()
    return response.status (200).send ()
  }

  async destroy ({ params, auth, response }) {
    const lyric = await Lyric.findOrFail (params.id)
    const post = await lyric.post ().fetch ()

    if (post.user_id !== auth.user.id) {
      return response
        .status (401)
        .json ({ message: 'Acesso negado' })
    }

    await Drive.disk ('s3').delete (lyric.path)
    lyric.delete ()

    return response
      .status (200)
      .send ()
  }
}

module.exports = LyricController
