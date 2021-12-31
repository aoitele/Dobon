import { HandleEmitFn, Emit } from "../../@types/socket"
import { Board } from "../../@types/game"
import { RoomAPIResponse } from '../../@types/api/roomAPI'

export interface Props {
  emitData: {
    boardState: Board
    room: RoomAPIResponse.RoomInfo
    userId?: number
    event?: string
    handleEmit: HandleEmitFn
  }
}

const emit = async({ emitData } : Props) => {
  const { boardState, room, userId, event, handleEmit } = emitData
  if (!boardState || !room || !event || !handleEmit) return
  switch (event) {
    case 'drawcard': {
      const data:Emit = {
        roomId: room.id,
        userId,
        event: 'drawcard',
        data: { type: 'board', data: boardState }
      }
      await handleEmit(data)
      break
    }
    case 'turnchange': {
      const data:Emit = {
        roomId: room.id,
        event: 'turnchange',
        data: { type: 'board', data: boardState }
      }
      await handleEmit(data)
      break
    }
    default : 
  }
}

const createEmitFnArgs = ({ boardState, room, userId, event, handleEmit}: Props['emitData']) => {
  return { emitData: { boardState, room, userId, event, handleEmit }}
}

export { emit, createEmitFnArgs}