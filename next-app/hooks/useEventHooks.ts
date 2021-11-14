import { useEffect } from 'react'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState } from '../utils/game/roomStateReducer'
import { AuthState } from '../context/authProvider'

const useEventHooks = (state: gameInitialState, handleEmit: HandleEmitFn, authUser:AuthState['authUser']) => {
  const { roomId, game } = state
  console.log(authUser, 'authUser')
  useEffect(() => {
    if (!state || !game?.event || !authUser) {
      return
    }

    const handler = () => {
      switch (game.event) {
        case 'join': {
          console.log('join')
          break
        }
        case 'gamestart': {
          console.log('ゲームを開始します')
          if (game.status === 'playing' && roomId) {
            const data: Emit = {
              roomId,
              gameId: game.id || null,
              userId: authUser.id,
              event: 'gethand'
            }
            handleEmit(data)
            data.event = 'getusers'
            handleEmit(data)
          }
          break
        }
        case 'gethand': {
          console.log('gethand HookS!')
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
