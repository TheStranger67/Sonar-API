'use strict'

const User = use ('App/Models/User')
const Company = use ('App/Models/Company')

class AuthController {
  async index ({ request, auth, response }) { 
    const { email, password } = request.all ()
    
    try {
      const jwt = await auth.attempt (email, password)
      const user = await User.findByOrFail ('email', email)

      return {
        token: jwt.token,
        userID: user.id,
        userName: user.name,
        level: user.level
      }
    }
    catch (error) {
      try {
        const jwt = await auth
          .authenticator ('company')
          .attempt (email, password)
        
        const company = await Company.findByOrFail ('email', email)

        return {
          token: jwt.token,
          userID: company.id,
          userName: company.razsoc,
          level: 9317
        }
      }
      catch (error) {
        return response
          .status (401)
          .json ({message: 'O e-mail ou a senha estão incorretos'})
      }
    }
  }
}

module.exports = AuthController
