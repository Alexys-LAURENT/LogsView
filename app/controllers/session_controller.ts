import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    let adminUser: User
    /**
     * Step 1: Get credentials from the request body
     */
    const { password } = request.only(['password'])

    /**
     * Step 2: Verify if the user exists
     */
    const userExist = await User.findBy('email', env.get('ADMIN_EMAIL'))

    if (!userExist) {
      const createdUser = await User.create({
        email: env.get('ADMIN_EMAIL'),
        password: env.get('ADMIN_PASSWORD'),
        fullName: 'Admin',
      })
      adminUser = createdUser
    } else {
      adminUser = userExist
    }

    /**
     * Step 3: Verify the password using the hash service
     */
    const isPasswordValid = await adminUser.verifyPassword(password)

    if (!isPasswordValid) {
      return response.redirect().withQs({ error: 'Invalid password' }).toRoute(`front.login`)
    }

    /**
     * Step 4: Login user
     */
    await auth.use('web').login(adminUser)

    /**
     * Step 5: Send them to a protected route
     */
    response.redirect().toRoute('/')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
