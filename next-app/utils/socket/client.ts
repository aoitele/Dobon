import { io, Socket } from 'socket.io-client'
import { Emit } from '../../@types/socket'

class SocketClient {
  _socket: Socket | null

  constructor() {
    this._socket = null
  }

  async connect(roomId?: string): Promise<void> {
    await this.disconnect()
    const socketIoUri = roomId
    ? `${process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN}?roomId=${roomId}`
    : `${process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN}` ?? ''
    this._socket = io(socketIoUri)
  }
  
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this._socket?.close()
      resolve()
    })
  }

  emit(data: Emit): Promise<any> {
    if (!this._socket) return Promise.reject(new Error('WS is not established'))
    return Promise.resolve(this._socket.emit('emit', data))
  }

  _reset() {
    this._socket = null
  }
}
// eslint-disable-next-line
const resSocketClient = async (): Promise<SocketClient | null> => new SocketClient() // prettier-ignore

export { SocketClient, resSocketClient }
