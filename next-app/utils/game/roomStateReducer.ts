import { Game } from '../../@types/game'
import { SocketClient } from '../socket/client'
import { PartiallyPartial, NestedPartial } from '../../@types/utility'

export type gameInitialState = {
  roomId: number | null
  userId: number | null
  game: Game
  connected: boolean
  wsClient: SocketClient | null
}

// State全体の更新時に使用
export type reducerPayload = PartiallyPartial<
  gameInitialState,
  'connected' | 'wsClient'
>

// 指定プロパティのみ更新時に使用(roomIdは必須)
export type reducerPayloadSpecify = NestedPartial<gameInitialState>
// [K in keyof gameInitialState]?: Partial<gameInitialState[K]>;

// Export type reducerPayloadSpecify = PartiallyRequired<PartialPayload, 'roomId'>

export interface wsClientSet {
  type: 'wsClientSet'
  payload: gameInitialState
}

export interface updateState {
  type: 'updateState'
  payload: reducerPayload
}

export interface updateStateSpecify {
  type: 'updateStateSpecify'
  payload: reducerPayloadSpecify
}

export type Action = wsClientSet | updateState | updateStateSpecify

export const reducer = (state: gameInitialState, action: Action) => {
  switch (action.type) {
    case 'wsClientSet': {
      const { connected, wsClient, roomId } = action.payload
      return { ...state, connected, wsClient, roomId }
    }
    case 'updateState': {
      console.log(state, 'updateState state')
      const { roomId, game } = action.payload
      return { ...state, roomId, game }
    }
    case 'updateStateSpecify': {
      return { ...state }
    }
    default:
      return state
  }
}
