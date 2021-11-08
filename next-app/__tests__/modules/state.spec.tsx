/**
 * ゲームのState更新を行う関数のテスト
 * 更新対象のキーのみpayloadで渡し、更新されたStateObjectが返却される
 */

import { initialState, useUpdateStateFn } from '../../utils/game/state'
import {
  reducerPayloadSpecify,
  gameInitialState
} from '../../utils/game/roomStateReducer'
import { Player } from '../../@types/game'

describe('gameState TestCases', () => {
  it('Stateを1つだけ更新する', () => {
    const payload: reducerPayloadSpecify = {
      game: {
        event: 'gamestart'
      }
    }
    const result = useUpdateStateFn(initialState, payload)
    const expected: gameInitialState = {
      roomId: null,
      userId: null,
      game: {
        id: null,
        status: 'join',
        event: 'gamestart',
        board: {
          users: [],
          deck: [],
          hands: [],
          trash: []
        }
      },
      connected: false,
      wsClient: null
    }
    expect(result).toStrictEqual(expected)
  })
  it('ネストされたStateを更新する', () => {
    const user: Player = {
      id: 1,
      image: 'hoge.jpg',
      nickname: 'taro',
      score: 0,
      turn: 0
    }

    const payload: reducerPayloadSpecify = {
      game: {
        event: 'gamestart',
        board: {
          users: [user]
        }
      }
    }
    const result = useUpdateStateFn(initialState, payload)
    const expected: gameInitialState = {
      roomId: null,
      userId: null,
      game: {
        id: null,
        status: 'join',
        event: 'gamestart',
        board: {
          users: [user],
          deck: [],
          hands: [],
          trash: []
        }
      },
      connected: false,
      wsClient: null
    }
    expect(result).toStrictEqual(expected)
  })
})