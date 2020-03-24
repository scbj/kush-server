import mongoose from 'mongoose'

import { ipAddress, operatingSystem } from './validators'
import { createTransform } from './options'

// string max length
const maxLength = 150

const Schema = mongoose.Schema
const ExtensionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  ip: {
    type: String,
    trim: true,
    validate: ipAddress
  },
  os: {
    type: String,
    trim: true,
    validate: operatingSystem
  },
  navigator: {
    type: String,
    trim: true,
    maxLength
  }
}, {
  timestamps: true
})

ExtensionSchema.set('toJSON', createTransform({
  __v: 0,
  _id: 0,
  user_id: 0
}))

const ExtensionModel = mongoose.model('Extension', ExtensionSchema)

export default ExtensionModel
