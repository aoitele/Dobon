// Import { Redis } from "ioredis"
import { Socket } from "socket.io-client"
import { Emit } from "../@types/socket"

/**
 * CPU対戦におけるサーバー側の処理
 */
const cpuModeHandler = (io: Socket, socket: any) => {
  console.log('cpuModeHandler')
  // Const adapterPubClient: Redis = socket.adapter.pubClient
  socket.on('emit', (payload: Emit) => {
    console.log(payload, 'payload')
    console.log(socket.id, 'socket.id')
    const { event } = payload
    console.log(event, 'event')
  })
}

export { cpuModeHandler }