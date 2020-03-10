import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import http from 'http'
import methodOverride from 'method-override'
import morgan from 'morgan'
import socketIO from 'socket.io'

import routes from './routes'
import Constants from './config/constants'

const app = express()
const server = http.createServer(app)

// Mount Socket.io
const io = socketIO(server)

// Helmet helps you secure your Express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet())

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors())

// Request logger
// https://github.com/expressjs/morgan
if (!Constants.envs.test) {
  app.use(morgan('dev'))
}

io.on('connection', socket => {
  console.log('⚡  Client connected!')
  socket.on('playback:musicChanged', data => {
    console.log('🐞: playback:musicChanged')
    socket.broadcast.emit('playback:musicChanged', data)
  })
  socket.emit('foo', { hello: 'bar' })
  socket.on('click', function (data) {
    console.log('🐞: click', data)
    socket.emit('USER_CLICKED', data)
  })
})

// Parse incoming request bodies
// https://github.com/expressjs/body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Lets you use HTTP verbs such as PUT or DELETE
// https://github.com/expressjs/method-override
app.use(methodOverride())

// Mount public routes
app.use('/public', express.static(`${__dirname}/public`))

// Mount API routes
app.use(Constants.apiPrefix, routes)

server.listen(Constants.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${Constants.port}
    Env: ${app.get('env')}
  `)
})

export default app
