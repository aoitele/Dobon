/**
 * InitialGameState -> gameStateで使用するデフォルト値
 * updateStateFn    -> payloadに存在するプロパティでStateを更新して返却する
 */

import {
  gameInitialState,
  reducerPayload,
  reducerPayloadSpecify
} from './roomStateReducer'
import { isObjectType } from '../function/typeCheck'

const initialState: gameInitialState = {
  roomId: null,
  userId: null,
  game: {
    id: null,
    status: 'join',
    event: {
      user: { nickname:'', turn:0 },
      action: null,
      message: null
    },
    board: {
      users: [],
      deckCount: 0,
      hands: [],
      trash: [],
      otherHands: [],
      turn: null,
      effect: []
    }
  },
  connected: false,
  wsClient: null
}

export interface AnotateState extends gameInitialState {
  [key: string]: any
}

interface AnotatePayload extends reducerPayload {
  [key: string]: any
}

interface AnotatePayloadSpecify extends reducerPayloadSpecify {
  [key: string]: any
}

const updateState = (
  state: AnotateState,
  payload: AnotatePayload | AnotatePayloadSpecify
) => {
  for (const key of Object.keys(payload)) {
    if (isObjectType(payload[key])) {
      updateState(state[key], payload[key]) // 再帰的に呼び出す
    } else {
      state[key] = payload[key] // Stateを更新
    }
  }
  return state
}

const useUpdateStateFn = (
  state: gameInitialState,
  payload: reducerPayload | reducerPayloadSpecify
) => updateState(state, payload)

export { initialState, useUpdateStateFn }
