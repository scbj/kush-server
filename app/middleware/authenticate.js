import User from '../models/user'
import identity from '../services/identity'

const token = ({ authorization }) => {
  return authorization.slice(7)
}

export default async function authenticate (req, res, next) {
  const { user: decoded, error } = await identity.verify(token(req.headers))
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
