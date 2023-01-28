import { Socket } from "socket.io"
import { Player } from "../../../@types/game"
import { reducerPayloadSpecify } from "../roomStateReducer"

const cpuMainProcess = (io: Socket, pveKey:string, user: Player) => {
  console.log('cpuMainProcess start...')
  // 手札を場に出す
  const reducerPayload: reducerPayloadSpecify = {
    game: {
      board: {
        trash: {
          card: 'd3o',
        }
      }
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload)
}

export { cpuMainProcess }