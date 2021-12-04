import { HandleEmitFn, Emit } from "../../@types/socket"
import { Board } from "../../@types/game"
import { RoomAPIResponse } from '../../@types/api/roomAPI'

interface Props {
  boardState: Board
  room: RoomAPIResponse.RoomInfo
  event: string
  handleEmit: HandleEmitFn
}

const emit = ({ boardState, room, event, handleEmit } : Props) => {
  if (!boardState || !room || !event || !handleEmit) return
  switch (event) {
    case 'turnchange': {
      const emitData:Emit = {
        roomId: room.id,
        event: 'turnchange',
        data: { type: 'board', data: boardState }
      }
      handleEmit(emitData)
      break
    }
    default : 
  }
}

export default emit