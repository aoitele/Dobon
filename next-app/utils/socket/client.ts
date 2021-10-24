import { io, Socket } from 'socket.io-client'

class SocketClient {
  socket: Socket

  constructor(roomId: string) {
    this.socket = io(
      `${process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN}?roomId=${roomId}`
    )
  }
}
// eslint-disable-next-line
const resSocketClient = async (roomId: string): Promise<SocketClient | null> => new SocketClient(roomId) // prettier-ignore

export { SocketClient, resSocketClient }
