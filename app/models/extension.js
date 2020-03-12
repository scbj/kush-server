import mongoose from 'mongoose'

import { ipAddress, operatingSystem } from './validators'
import { transformId } from './options'

// string max length
const maxLength = 150

const Schema = mongoose.Schema
const ExtensionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ip: {
    type: String,
    required: true,
    trim: true,
    validate: ipAddress
  },
  os: {
    type: String,
    required: true,
    trim: true,
    validate: operatingSystem
  },
  navigator: {
    type: String,
    required: true,
    trim: true,
    maxLength
  }
}, {
  timestamps: true
})

ExtensionSchema.set('toJSON', transformId)

const ExtensionModel = mongoose.model('Extension', ExtensionSchema)

export default ExtensionModel
