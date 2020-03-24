import mongoose from 'mongoose'

import security from '../security'
import { createTransform } from './options'

const Schema = mongoose.Schema
const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required.']
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Email is required'],
    validate: {
      validator (email) {
        const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i
        return emailRegex.test(email)
      },
      message: '{VALUE} is not a valid email.'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true
})

UserSchema.set('toJSON', createTransform({
  __v: 0,
  _id: 0,
  password: 0
}))

// Ensure email has not been taken
UserSchema
  .path('email')
  .validate(email => {
    return new Promise(resolve => {
      UserModel.findOne({ email })
        .then((user) => {
          resolve(!user)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }, 'Email already in use.')

// Validate username is not taken
UserSchema
  .path('username')
  .validate(username => {
    return new Promise(resolve => {
      UserModel.findOne({ username })
        .then((user) => {
          resolve(!user)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }, 'Username already taken.')

// Validate password field
UserSchema
  .path('password')
  .validate(function (password) {
    return password.length >= 6 && password.match(/\d+/g)
  }, 'Password be at least 6 characters long and contain 1 number.')

UserSchema
  .pre('save', async function () {
    // Encrypt password before saving the document
    if (this.isModified('password')) {
      const { error, hash } = await security.password.secure(this.password)
      if (error) {
        throw new Error("pre 'save' failed")
      }
      this.password = hash
    }
  })

/**
 * User Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   * @public
   * @param {String} password
   * @return {Boolean} passwords match
   */
  async authenticate (password) {
    const { equable, error } = await security.password.compare(password, this.password)
    if (error) {
      throw new Error('unable to authenticate')
    }
    return equable
  },

  /**
   * Generates a JSON Web token used for route authentication
   * @public
   * @return {String} signed JSON web token
   */
  async generateToken () {
    const payload = {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role
    }
    const { accessToken, error } = await security.identity.sign(payload)
    if (error) {
      throw new Error('unable to generate token')
    }
    return accessToken
  }
}

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
