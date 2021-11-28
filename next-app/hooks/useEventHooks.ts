import { useEffect } from 'react'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState } from '../utils/game/roomStateReducer'
import { AuthState } from '../context/authProvider'
import sleep from '../utils/game/sleep'

const useEventHooks = (state: gameInitialState, handleEmit: HandleEmitFn, authUser:AuthState['authUser']) => {
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
        default:
          break
      }
    }
    handler()
  }, [game?.event])
}

export default useEventHooks
