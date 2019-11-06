'use strict'

const Route = use ('Route')

Route.get ('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post ('/auth', 'AuthController.index')
  .validator ('Login')

Route.resource ('users', 'UserController')
  .apiOnly ()
  .middleware (new Map ([
    [['show', 'update', 'destroy'], ['auth']]
  ]))
  .validator (new Map ([
    [['store'], ['StoreUser']],
    [['update'], ['UpdateUser']]
  ]))

Route.resource ('profiles', 'ProfileController')
  .apiOnly ()

Route.resource ('companies', 'CompanyController')
  .apiOnly ()
  .middleware (new Map ([
    [['show', 'update', 'destroy'], ['auth']]
  ]))
  .validator (new Map ([
    [['store'], ['StoreCompany']],
    [['update'], ['UpdateCompany']]
  ]))

Route.resource ('posts', 'PostController')
  .apiOnly ()
  .middleware (new Map ([
    [['store', 'update', 'destroy'], ['auth']]
  ]))
  .validator (new Map ([
    [['update'], ['UpdatePost']]
  ]))

Route.resource ('songs', 'SongController')
  .apiOnly ()
  .middleware (new Map ([
    [['update', 'destroy'], ['auth']]
  ]))

Route.resource ('lyrics', 'LyricController')
  .apiOnly ()
  .middleware (new Map ([
    [['update', 'destroy'], ['auth']]
  ]))

Route.group (() => {
  Route.get ('ratings', 'RatingController.show')
  Route.put ('ratings', 'RatingController.update')
    .middleware ('auth')
  Route.delete ('ratings', 'RatingController.destroy')
    .middleware ('auth')
}).prefix ('posts/:id')
