/**
 * State.game.event.actionへのHooks
 * サーバーへのemitやローカルステートの更新を行う
 * ローカルステートのevent更新は/server/emitHandler.tsが担う
 */

import { useEffect, Dispatch } from 'react'
import { HandleEmitFn, Emit, Event } from '../@types/socket'
import { gameInitialState, Action, reducerPayloadSpecify } from '../utils/game/roomStateReducer'
import { AuthState } from '../context/authProvider'
import { RoomAPIResponse } from '../@types/api/roomAPI'
import { useUpdateStateFn } from '../utils/game/state'
import { updateHandsFn } from '../utils/game/checkHand'

const hookEventCases:Event[] = [
  'preparecomplete',
  'gethand',
  'dobon',
  'dobonsuccess',
  'dobonfailure',
  'skip',
  'draw2',
  'draw4',
  'draw6',
  'draw8',
  'reverse',
  'opencard',
  'wild',
]


const useEventHooks = (
  state: gameInitialState,
  handleEmit: HandleEmitFn,
  authUser:AuthState['authUser'],
  room: RoomAPIResponse.RoomInfo,
  dispatch: Dispatch<Action>
) => {
  useEffect(() => {
    const action = state.game?.event.action
    if (!action || !hookEventCases.includes(action)) return
    const { game, roomId } = state
    if (!roomId || !game || game.event.action === null || !authUser) return
    const { event } = game

    const handler = async () => {
      switch (event.action) {
        case 'preparecomplete': {
          if (roomId) {
            const data: Emit = {
              roomId,
              gameId: game.id,
              userId: authUser.id,
              event: 'gethand'
            }
            await handleEmit(data)
            if (room.create_user_id === authUser.id) {
              data.event = 'gamestart'
              await handleEmit(data)
            }
          }
          break
        }
        case 'gethand': {
          if (roomId) {
            const data: Emit = {
              roomId,
              gameId: game.id || null,
              userId: authUser.id,
              event: 'gethand'
            }
            await handleEmit(data)
            updateHandsFn({state, authUser, dispatch})
          }
          break
        }
        case 'dobon':
        case 'dobonsuccess':
        case 'dobonfailure':
        case 'dobonreverse':
        case 'skip':
        case 'draw2':
        case 'draw4':
        case 'draw6':
        case 'draw8':
        case 'reverse':
        case 'opencard':
        case 'wild': {
          const data: reducerPayloadSpecify = {
            game: {
              event: {
                user: { nickname: event.user.nickname, turn: event.user.turn },
                action: event.action,
              }
            }
          }
          const newState = useUpdateStateFn(state, data)
          dispatch({ type: 'updateStateSpecify', payload: newState })
          break
        }
      
        default:
          break
      }
    }
    handler()
    .then(
      () => {
        const resetEvents:Event[] = ['preparecomplete', 'gethand']
        if (resetEvents.includes(event.action)) {
          const data: reducerPayloadSpecify = {
            game: {
              event: {
                user: { nickname:'', turn:0 },
                action: null,
                message: null
              }
            }
          }
          const newState = useUpdateStateFn(state, data)
          dispatch({ type: 'updateStateSpecify', payload: newState })
        }  
      }
    )
  }, [state.game?.event.action])
}

export default useEventHooks
