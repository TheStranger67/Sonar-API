'use strict'

const User = use ('App/Models/User')

class ProfileController {
  async show ({ request, params }) {
    const user = await User.findOrFail (params.id)
    const { page = 1, order } = request.get ()
    const perPage = 6;

    const query = user.posts ()
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
}

module.exports = ProfileController
