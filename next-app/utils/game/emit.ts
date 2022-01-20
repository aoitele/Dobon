import { HandleEmitFn, Emit } from "../../@types/socket"
import { Board, Player } from "../../@types/game"
import { RoomAPIResponse } from '../../@types/api/roomAPI'

export interface Props {
  emitData: {
    boardState: Board
    room: RoomAPIResponse.RoomInfo
    user: Player
    userId?: number
    event?: string
    handleEmit: HandleEmitFn
  }
}

const emit = async({ emitData } : Props) => {
  const { boardState, room, userId, user, event, handleEmit } = emitData
  if (!boardState || !room || !event || !handleEmit) return
  switch (event) {
    case 'drawcard': {
      const data:Emit = {
        roomId: room.id,
        user,
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
        user,
        event: 'turnchange',
        data: { type: 'board', data: boardState }
      }
      await handleEmit(data)
      break
    }
    case 'dobon': {
      const data:Emit = {
        roomId: room.id,
        user,
        event: 'dobon',
        data: { type: 'board', data: boardState }
      }
      await handleEmit(data)
      break
    }
    default : 
  }
}

const createEmitFnArgs = ({ boardState, room, user, userId, event, handleEmit}: Props['emitData']) => {
  return { emitData: { boardState, room, user, userId, event, handleEmit }}
}

export { emit, createEmitFnArgs}