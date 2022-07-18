import { HandleEmitFn, Emit, EmitBoard } from "../../@types/socket"
import { Board, Player } from "../../@types/game"
import { RoomAPIResponse } from '../../@types/api/roomAPI'

export interface Props {
  emitData: {
    boardState: Board
    room: RoomAPIResponse['roomInfo']
    user: Player
    userId?: number
    event?: string
    options?: EmitBoard['option']
    handleEmit: HandleEmitFn
  }
}

const emit = async({ emitData } : Props) => {
  const { boardState, room, userId, user, event, options, handleEmit } = emitData
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
    case 'drawcard__deckset': {
      const data:Emit = {
        roomId: room.id,
        user,
        userId,
        event: 'drawcard__deckset',
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
        data: {
          type: 'board',
          data: boardState,
          option: {
            values: {
              isMyTurnConsecutive: options?.values.isMyTurnConsecutive,
            },
            triggered: options?.triggered || undefined
          }
        }
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

const createEmitFnArgs = ({ boardState, room, user, userId, event, options, handleEmit}: Props['emitData']) => {
  return { emitData: { boardState, room, user, userId, event, options, handleEmit }}
}

export { emit, createEmitFnArgs}