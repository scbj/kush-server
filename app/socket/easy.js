import createSocketIO from 'socket.io'

import {
  EVENT_PLAYBACK_STATUS_CHANGED,
  EVENT_PLAYBACK_TRACK_CHANGED,
  ACTION_PLAYBACK_NEXT,
  ACTION_PLAYBACK_PLAY,
  ACTION_PLAYBACK_PREVIOUS,
  ACTION_PLAYBACK_TOGGLE_STATUS
} from '@bit/scbj.kush.constants'

let io = null

const extensions = {}

function authenticate ({ accessToken }) {
  return {
    user: {
      name: 'John Doe'
    }
    // error: 'An error occured'
  }
}

function createExtensionClient (socket) {
  const { extensionId } = socket.handshake.query

  if (extensionId in extensions) {
    throw new Error(`extensionId ${extensionId} already exist in extension list`)
  }

  extensions[extensionId] = socket

  // Quand l'extension envoi au serveur (ici) un message il doit être transmis aux Apps
  const broadcast = event => {
    socket.on(event, payload => socket.broadcast.to(extensionId).emit(event, payload))
  }
  broadcast(EVENT_PLAYBACK_STATUS_CHANGED)
  broadcast(EVENT_PLAYBACK_TRACK_CHANGED)

  // Lorsque qu'une app envoi un message (action) au serveur (ici), il doit être transmis également au Apps

  // Quand l'extension se déconnecte, il faut enlever tous les autres socket de la room et enlever l'extension
  // de la liste des extensions
  socket.on('disconnect', () => {
    io.of('/').in(extensionId).clients((error, socketIds) => {
      if (error) throw error
      socketIds.forEach(socketId => {
        console.log('🐞: Force to leave the room -> socketId', socketId)
        io.sockets.sockets[socketId].leave(extensionId)
      })
    })
    socket.disconnect()
    delete extensions[extensionId]
    console.log('🐞: createExtensionClient -> Object.keys(extensions)', Object.keys(extensions))
  })
}

function createAppClient (socket) {
  const joinRoom = ({ extensionId }) => {
    if (extensionId in extensions) {
      socket.join(extensionId)
      const broadcast = event => {
        socket.on(event, payload => {
          console.log('🐞: createExtensionClient -> Object.keys(extensions)', Object.keys(extensions))
          extensions[extensionId].emit(event, payload)
        })
      }
      broadcast(ACTION_PLAYBACK_NEXT)
      broadcast(ACTION_PLAYBACK_PLAY)
      broadcast(ACTION_PLAYBACK_PREVIOUS)
      broadcast(ACTION_PLAYBACK_TOGGLE_STATUS)
    }
  }
  socket.on('extension:connect', joinRoom)
  socket.on('disconnect', () => {
    socket.disconnect()
  })
}

function handleConnection (socket) {
  // Real time needs to authenticate packets otherwise disconnect the socket
  const { error } = authenticate(socket.handshake.query)
  if (error) return socket.disconnect()

  const clientType = socket.handshake.query.type
  switch (clientType) {
    case 'extension':
      return createExtensionClient(socket)
    default:
      return createAppClient(socket)
  }
}

/** Instanciate and start Socket.io on the specified server. */
export function enableRealTime (server) {
  // Create fresh new instance of Socket.io
  io = createSocketIO(server)

  // Handle connection from extensions and web apps
  io.on('connection', handleConnection)
}
