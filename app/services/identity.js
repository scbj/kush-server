import jwt from 'jsonwebtoken'
import Constants from '../config/constants'

const { sessionSecret } = Constants.security

function verify (token) {
  return new Promise(resolve => {
    try {
      const decoded = jwt.verify(token, sessionSecret)
      resolve({ user: decoded })
    } catch (error) {
      resolve({ error })
    }
  })
}

export default {
  verify
  // TODO: signup and resetPassword functions
}
