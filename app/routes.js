import { Router } from 'express'

import MetaController from './controllers/meta.controller'
import AuthController from './controllers/auth.controller'
import UsersController from './controllers/users.controller'
import PostsController from './controllers/posts.controller'

import authenticate from './middleware/authenticate'
import accessControl from './middleware/access-control'
import errorHandler from './middleware/error-handler'

const routes = new Router()

routes.get('/', MetaController.index)

// Authentication
routes.post('/auth/login', AuthController.login)

// Users
routes.get('/user', UsersController.search)
routes.post('/user', UsersController.create)
routes.get('/user/me', authenticate, UsersController.fetch)
routes.put('/user/me', authenticate, UsersController.update)
routes.delete('/user/me', authenticate, UsersController.delete)
routes.get('/user/:username', UsersController._populate, UsersController.fetch)

// Post
routes.get('/posts', PostsController.search)
routes.post('/posts', authenticate, PostsController.create)
routes.get('/posts/:id', PostsController._populate, PostsController.fetch)
routes.delete('/posts/:id', authenticate, PostsController.delete)

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index)

routes.use(errorHandler)

export default routes
