import BaseController from './base.controller'
import User from '../models/user'

class AuthController extends BaseController {
  async login (req, res, next) {
    const { username, password } = req.body

    try {
      const user = await User.findOne({ username })

      if (!user || !await user.authenticate(password)) {
        const err = new Error('Please verify your credentials.')
        err.status = 401
        return next(err)
      }

      const accessToken = await user.generateToken()
      return res.status(200).json({ accessToken })
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
