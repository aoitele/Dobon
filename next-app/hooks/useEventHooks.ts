import { useEffect, Dispatch } from 'react'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState, Action } from '../utils/game/roomStateReducer'
import { AuthState } from '../context/authProvider'
import sleep from '../utils/game/sleep'
import { useUpdateStateFn } from '../utils/game/state'

const useEventHooks = (
  state: gameInitialState,
  handleEmit: HandleEmitFn,
  authUser:AuthState['authUser'],
  dispatch: Dispatch<Action>
) => {
  const { roomId, game } = state
  useEffect(() => {
    if (!state || !game?.event || !authUser) return

    const handler = async() => {
      switch (game.event) {
        case 'prepare': {
          if (roomId) {
            const data: Emit = {
              roomId,
              gameId: game.id || null,
              userId: authUser.id,
              event: 'gethand'
            }
            handleEmit(data)
            await sleep(3000)
            data.event = 'gamestart'
            handleEmit(data)
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
            handleEmit(data)
          }
          break
        }
        default:
          break
      }
    }
    handler().then(
      () => {
        const data = { game: { event: null } }
        const newState = useUpdateStateFn(state, data)
        dispatch({ type: 'updateStateSpecify', payload: newState })
      }
    )
  }, [game?.event])
}

export default useEventHooks
