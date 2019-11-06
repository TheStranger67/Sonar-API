'use strict'

const ModelFilter = use('ModelFilter')

class PostFilter extends ModelFilter {
  content (content) {
    switch (content) {
      case 'songs':
        return this.has ('songs').doesntHave ('lyrics')
      case 'lyrics':
        return this.has ('lyrics').doesntHave ('songs')
      case 'both':
        return this.has ('songs').has ('lyrics')
      default: return
    }
  }
}

module.exports = PostFilter
