import User from '../models/user'
import security from '../security'

export default async function authenticate (req, res, next) {
  const token = req.headers.authorization.slice(7)
  const { user: decoded, error } = await security.identity.verify(token)
  if (error) {
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
}
