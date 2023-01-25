import { io, Socket } from 'socket.io-client'
import { Emit, EmitForPVE } from '../../@types/socket'

interface ConnectArgs {
  roomId?: string
  pveKey?: string
}

class SocketClient {
  _socket: Socket | null

  constructor() {
    this._socket = null
  }

  async connect(args?: ConnectArgs): Promise<void> {
    await this.disconnect()
    let socketIoUri = process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN
    if (!socketIoUri) return

    if (args) {
      const { roomId, pveKey } = args
      if (roomId) socketIoUri += `?roomId=${roomId}`
      if (pveKey) socketIoUri += `?pveKey=${pveKey}`
    }

    this._socket = io(socketIoUri)
  }
  
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this._socket?.close()
      resolve()
    })
  }

  emit(data: Emit | EmitForPVE): Promise<any> {
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
