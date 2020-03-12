export default class {
  constructor (io, socket) {
    console.log(`WS: New WebAppClient: ${socket.id}`)
    this.io = io
    this.socket = socket

    this.enableConnectionToExtension()
  }

  enableConnectionToExtension () {
    const joinRoom = ({ extensionId: roomId }) => {
      this.socket.join(roomId)
      console.log(`WS: App join ${roomId}`)
    }
    this.socket.on('extension:connect', joinRoom)
  }
}
