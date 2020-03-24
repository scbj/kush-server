import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import constants from './config/constants'

/**
 * Check if a specified password equal a specified hash password.
 * @param {String} password The password in clear
 * @param {String} passwordHash The encrypted password
 */
function compare (password, passwordHash) {
  return new Promise(resolve => {
    bcrypt.compare(password, passwordHash, (error, result) => {
      if (error) {
        return resolve({ error })
      }
      resolve({ equable: result })
    })
  })
}

/**
 * Hash a password.
 * @param {String} password The password in clear
 */
function secure (password) {
  return new Promise(resolve => {
    const { saltRounds } = constants.security
    bcrypt.hash(password, saltRounds, (error, hash) => {
      if (error) {
        return resolve({ error })
      }
      resolve({ hash })
    })
  })
}

/**
 * Verify given access token and return the decoded payload.
 * @param {String} accessToken
 */
function verify (accessToken) {
  return new Promise(resolve => {
    const { sessionSecret } = constants.security
    jwt.verify(accessToken, sessionSecret, (error, decoded) => {
      if (error) {
        return resolve({ error })
      }
      resolve({ user: decoded })
    })
  })
}

/**
 * Create JSON Web Token from specified payload.
 * @param {Object} payload
 */
function sign (payload) {
  return new Promise(resolve => {
    const { sessionSecret, sessionExpiration } = constants.security

    // Create options then create JWT
    const options = {
      expiresIn: sessionExpiration
    }
    jwt.sign(payload, sessionSecret, options, (error, accessToken) => {
      if (error) {
        return resolve({ error })
      }
      return resolve({ accessToken })
    })
  })
}

export default {
  password: {
    compare,
    secure
  },
  identity: {
    sign,
    verify
  }
}
