import { HandleEmitFn, Emit } from "../../@types/socket"
import { Board } from "../../@types/game"
import { RoomAPIResponse } from '../../@types/api/roomAPI'

const turnChange = (
  boardState: Board,
  room: RoomAPIResponse.RoomInfo,
  handleEmit: HandleEmitFn
) => {
  if (!boardState) return
  const emitData:Emit = {
    roomId: room.id,
    event: 'turnchange',
    data: { type: 'board', data: boardState }
  }
  handleEmit(emitData)
}

export default turnChange