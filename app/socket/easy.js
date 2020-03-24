import createSocketIO from 'socket.io'
import configuration from '@bit/scbj.kush.configuration'

import security from '../security'

let io = null

const extensions = {}

function createExtensionClient (extensionId, { socket }) {
  if (extensionId in extensions) {
    throw new Error(`extensionId '${extensionId}' already exist in extension list`)
  }

  extensions[extensionId] = socket

  console.log(`The '${extensionId}' extension has just connected (total: ${Object.keys(extensions).length})`)

  // Quand l'extension envoi au serveur (ici) un message il doit être transmis aux Apps
  const broadcast = ({ emit: eventName }) => {
    const emit = payload =>
      socket.broadcast.to(extensionId).emit(eventName, payload)
    socket.on(eventName, emit)
  }
  configuration.watchers.forEach(broadcast)

  // Lorsque qu'une app envoi un message (action) au serveur (ici), il doit être transmis également au Apps

  // Quand l'extension se déconnecte, il faut enlever tous les autres socket de la room et enlever l'extension
  // de la liste des extensions
  socket.on('disconnect', () => {
    console.log(`The '${extensionId}' extension has just signed out!`)
    io.of('/').in(extensionId).clients((error, socketIds) => {
      if (error) throw error
      socketIds.forEach(socketId => {
        // TODO: Emit event to the applications of this room
        io.sockets.sockets[socketId].leave(extensionId)
      })
      console.log(`${socketIds.length} applications have left the '${extensionId}' room`)
    })
    socket.disconnect()
    delete extensions[extensionId]
  })
}

function createAppClient ({ socket, join: extensionId }) {
  if (extensionId in extensions === false) {
    console.log(`The requrested extension '${extensionId}' is not connected. App disconnected.`)
    return socket.disconnect()
  }

  socket.join(extensionId)

  console.log(`An application has joined the '${extensionId}' room`)

  const broadcast = ({ trigger: eventName }) => {
    const emit = payload =>
      extensions[extensionId].emit(eventName, payload)
    socket.on(eventName, emit)
  }
  configuration.commands.forEach(broadcast)

  // socket.on('extension:change', joinRoom)
  socket.on('disconnect', () => {
    console.log('An application has just signed out!')
    socket.disconnect()
  })
}

async function handleConnection (socket) {
  const { accessToken, extensionId, type } = socket.handshake.query

  // Real time needs to authenticate packets otherwise disconnect the socket
  const { error } = await security.identity.verify(accessToken)
  if (error || !extensionId) return socket.disconnect()

  switch (type) {
    case 'extension':
      return createExtensionClient(extensionId, { socket })
    default:
      return createAppClient({ socket, join: extensionId })
  }
}

/** Instanciate and start Socket.io on the specified server. */
export function enableRealTime (server) {
  // Create fresh new instance of Socket.io
  io = createSocketIO(server)

  // Handle connection from extensions and web apps
  io.on('connection', handleConnection)
}
