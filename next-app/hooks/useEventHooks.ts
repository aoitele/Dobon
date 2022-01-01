import { useEffect, Dispatch } from 'react'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState, Action } from '../utils/game/roomStateReducer'
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
  const { roomId, game } = state
  useEffect(() => {
    if (!state || !game?.event || !authUser) return

    const handler = async() => {
      switch (game.event) {
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
        default:
          break
      }
    }
    handler().then(
      () => {
        // State > eventをnullに戻す
        const data = { game: { event: null } }
        const newState = useUpdateStateFn(state, data)
        dispatch({ type: 'updateStateSpecify', payload: newState })
      }
    )
  }, [game?.event])
}

export default useEventHooks
