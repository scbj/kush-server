import createSocketIO from 'socket.io'

import { ExtensionClient, WebAppClient } from './clients'

function authenticate ({ accessToken }) {
  return {
    user: {
      name: 'John Doe'
    }
    // error: 'An error occured'
  }
}

function handleConnection (io, clientProvider) {
  return socket => {
    // Real time needs to authenticate packets otherwise disconnect the socket
    const { error } = authenticate(socket.handshake.query)
    if (error) return socket.disconnect()

    const clientType = socket.handshake.query.type || 'app'
    if (clientType in clientProvider) {
      const Client = clientProvider[clientType]
      return new Client(io, socket)
    }
  }
}

/** Instanciate and start Socket.io on the specified server. */
export function enableRealTime (server) {
  // Create fresh new instance of Socket.io
  const io = createSocketIO(server)

  // Handle connection from extensions and web apps
  io.on('connection', handleConnection(io, {
    app: WebAppClient,
    extension: ExtensionClient
  }))
}
