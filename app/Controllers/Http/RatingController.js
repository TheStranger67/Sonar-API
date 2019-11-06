'use strict'

const Rating = use ('App/Models/Rating')
const Post = use ('App/Models/Post')

const getAverageRating = post => {
  const avg = post.ratings.length > 0 ?
    post.ratings.map (rating => {
      return rating.value;
    }).reduce ((total, num) => {
      return total + num;
    }) / post.ratings.length
  : 0
  return Math.round (avg * 10) / 10
}

class RatingController {
  async show ({ request, params }) {
    const { page = 1 } = request.get ()
    const perPage = 8;
    
    const ratings = await Rating.query ()
      .with ('user', builder => {
        builder.select ('id', 'name')
      })
      .where ('post_id', params.id)
      .paginate (page, perPage)

    return ratings;
  }

  async update ({ params, request, auth }) {
    const { value, comment } = request.all ()
    const user_id = auth.user.id
    const post_id = params.id
    
    const post = await Post.findOrFail (post_id)
    const rating = await Rating.findOrCreate (
      { post_id, user_id },
      { post_id, user_id, value, comment }
    )
    
    rating.merge ({value})
    await rating.save ()
    await post.load ('ratings')
    
    const average_rating = getAverageRating (post.toJSON ())
    post.merge ({average_rating})
    await post.save ()

    return rating
  }

  async destroy ({ params, auth, response }) {
    const user_id = auth.user.id
    const post_id = params.id
    const rating = await Rating.findByOrFail ({user_id, post_id})
    const post = await Post.findOrFail (post_id)

    if (rating.user_id !== auth.user.id) {
      return response
        .status (401)
        .json ({ message: 'Acesso negado' })
    }

    rating.delete ()
    await rating.save ()
    await post.load ('ratings')

    const average_rating = getAverageRating (post.toJSON ())
    post.merge ({average_rating})
    await post.save ()

    return response
      .status (200)
      .send ()
  }
}

module.exports = RatingController
