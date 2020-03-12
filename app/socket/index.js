import createSocketIO from 'socket.io'

import { EVENT_PLAYBACK_STATUS_CHANGED } from '@bit/scbj.kush.constants'

function authenticate ({ accessToken }) {
  return {
    user: {
      name: 'John Doe'
    }
    // error: 'An error occured'
  }
}

// function az (io) {
//   const extensions = []
//   const subscribers = {}

//   const addExtension = (socket, extension) => {
//     const { name, user } = extension
//     extensions.push({ name, socket, user })
//   }

//   const subscribe = ({ socket, extensionId, user }) => {
//     if (extensionId in subscribers === false) {
//       subscribers[extensionId] = []
//     }
//     subscribers[extensionId].push({
//       socket,
//       user
//     })
//   }
// }

function handleAsExtension (extensionId, socket) {
  console.log('WS: Extension connected')
  socket.on(EVENT_PLAYBACK_STATUS_CHANGED, data => {
    socket.broadcast.to(extensionId).emit(EVENT_PLAYBACK_STATUS_CHANGED, data)
  })
  socket.on('disconnect', () => {
    // subscribers[extensionId].forEach(({ socket }) => socket.disconnect(true))
  })
}

function handleAsWebApp (socket) {
  console.log('WS: App connected')
  socket.on('extension:connect', ({ extensionId }) => {
    socket.join(extensionId)
    console.log(`WS: App join ${extensionId}`)
  })
}

function handleConnection (io) {
  const onConnection = socket => {
    const { error } = authenticate(socket.handshake.query)

    // Real time needs to authenticate packets otherwise disconnect the socket
    if (error) return socket.disconnect()

    const { extensionId } = socket.handshake.query
    if (extensionId) {
      handleAsExtension(extensionId, socket)
    } else {
      handleAsWebApp(socket)
    }
  }

  // Attach connection event
  io.on('connection', onConnection)
}

/** Instanciate and start Socket.io on the specified server. */
export function enableRealTime (server) {
  // Create fresh new instance of Socket.io
  const io = createSocketIO(server)

  // Handle connection from extensions and web apps
  handleConnection(io)
}
