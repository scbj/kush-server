import _ from 'lodash'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import Constants from '../config/constants'

const { sessionSecret } = Constants.security

const token = ({ authorization }) => {
  return authorization.slice(7)
}

export default function authenticate (req, res, next) {
  jwt.verify(token(req.headers), sessionSecret, async (err, decoded) => {
    if (err) {
      return res.sendStatus(401)
    }

    // If token is decoded successfully, find user and attach to our request
    // for use in our route or other middleware
    try {
      const user = await User.findById(decoded._id)
      if (!user) {
        return res.sendStatus(401)
      }
      req.currentUser = user
      next()
    } catch (err) {
      next(err)
    }
  })
}
