import {
  EVENT_PLAYBACK_STATUS_CHANGED,
  EVENT_PLAYBACK_TRACK_CHANGED
} from '@bit/scbj.kush.constants'

export default class {
  constructor (io, socket) {
    console.log(`WS: New ExtensionClient: ${socket.id}`)
    this.io = io
    this.socket = socket

    this.activateDirectBroadcasting()
  }

  activateDirectBroadcasting () {
    const { extensionId } = this.socket.handshake.query
    console.log('🐞: activateDirectBroadcasting -> this.socket.handshake.query', this.socket.handshake.query)
    console.log('🐞: activateDirectBroadcasting -> extensionId', extensionId)
    const broadcast = event => {
      this.socket.on(event, payload => this.socket.broadcast.to(extensionId).emit(event, payload))
    }
    broadcast(EVENT_PLAYBACK_STATUS_CHANGED)
    broadcast(EVENT_PLAYBACK_TRACK_CHANGED)
  }
}
