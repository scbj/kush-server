import mongoose from 'mongoose'

import { startWith, positiveNumber } from './validators'
import { transformId } from './options'

// string max length
const maxlength = 150

const Schema = mongoose.Schema

const TrackSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength
  },
  people: {
    type: String,
    required: true,
    trim: true,
    maxlength
  },
  duration: {
    type: Number,
    required: true,
    validate: positiveNumber
  },
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength,
    validate: startWith('https://'),
    /** @param {String} v */
    set (v) {
      const index = v.indexOf('?')
      return index === -1 ? v : v.substring(0, index)
    }
  },
  thumbnail: {
    type: String,
    trim: true,
    maxlength,
    validate: startWith('https://')
  }
}, {
  timestamps: true
})

TrackSchema.set('toJSON', transformId)

const TrackModel = mongoose.model('Track', TrackSchema)

export default TrackModel
