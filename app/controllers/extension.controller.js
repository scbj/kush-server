import mongoose from 'mongoose'
// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'

import Extension from '../models/extension'
import BaseController from './base.controller'

class ExtensionController extends BaseController {
  static createWhilelist = [
    'ip',
    'os',
    'navigator'
  ]

  /**
   * Add the specified extension instance in the request object (req.extension)
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async _populate (req, res, next) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.sendStatus(400)
    }

    try {
      const extension = await Extension.findOne({
        _id: id,
        user_id: req.currentUser._id
      })
      if (!extension) {
        return res.sendStatus(404)
      }
      req.extension = extension
      return next()
    } catch (err) {
      err.status = err.name === 'CastError' ? 404 : 500
      return next(err)
    }
  }

  /**
   * Create a new extension with the specified field values.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async create (req, res, next) {
    const params = super.filterParams(req.body, ExtensionController.createWhilelist)
    const extension = new Extension(params)

    try {
      extension.user_id = req.currentUser._id
      await extension.save()
      res.status(201).json(extension)
    } catch (err) {
      console.log('🐞: ExtensionController -> create -> err', err)
      next(err)
    }
  }

  /**
   * List all the extensions of the authenticated user.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async list (req, res, next) {
    try {
      const extensions = await Extension.find({
        user_id: req.currentUser._id
      })
      console.log('☝️: ExtensionController -> list -> extensions', extensions)
      res.json(extensions)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Delete the specified extension
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async delete (req, res, next) {
    const extension = req.extension

    // Ensure the user attempting to delete the extension owns the extension
    if (!req.currentUser.owns(extension)) {
      return res.sendStatus(404)
    }
    try {
      await req.extension.remove()
      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  }
}

export default new ExtensionController()
