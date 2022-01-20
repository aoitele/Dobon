/**
 * State.game.event.actionへのHooks
 * サーバーへのemitやローカルステートの更新を行う
 * ローカルステートのevent更新は/server/emitHandler.tsが担う
 */

import { useEffect, Dispatch } from 'react'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState, Action, reducerPayloadSpecify } from '../utils/game/roomStateReducer'
import { AuthState } from '../context/authProvider'
import { RoomAPIResponse } from '../@types/api/roomAPI'
import { useUpdateStateFn } from '../utils/game/state'
import { updateHandsFn } from '../utils/game/checkHand'

const useEventHooks = (
  state: gameInitialState,
  handleEmit: HandleEmitFn,
  authUser:AuthState['authUser'],
  room: RoomAPIResponse.RoomInfo,
  dispatch: Dispatch<Action>
) => {

  useEffect(() => {
    if (!state.roomId || !state.game || !state.game.event?.action || !authUser) return
    const { game, roomId } = state
    const { event } = state.game

    const handler = async() => {
      switch (event.action) {
        case 'preparecomplete': {
          if (roomId) {
            const data: Emit = {
              roomId,
              gameId: game.id || null,
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
        case 'dobon': {
          const data: reducerPayloadSpecify = {
            game: {
              event: {
                user: { nickname: event.user.nickname, turn: event.user.turn },
                action: 'dobon',
                message: 'ドボン発生!'
              }
            }
          }
          const newState = useUpdateStateFn(state, data)
          console.log('state update start -- dobon')
          dispatch({ type: 'updateStateSpecify', payload: newState })
          console.log('state update end -- dobon')

          break
        }
        case 'dobonsuccess': {
          console.log('dobonsuccess')
          break
        }
        case 'dobonfailure': {
          console.log('dobonfailure')
          break
        }
        default:
          break
      }
    }
    handler().then(
      () => {
        // Write next emit/dispatch if you need
      }
    )
  }, [state.game?.event.action])
}

export default useEventHooks
