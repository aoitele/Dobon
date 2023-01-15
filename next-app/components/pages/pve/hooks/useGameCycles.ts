/**
 * ゲーム実施状態のHooks
 */
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { GameDispathContext, GameStateContext } from '../../../../context/GameProvider'
import { useUpdateStateFn } from '../../../../utils/game/state'
import { handleEmit } from '../../../../utils/socket/emit'
import { establishWsForPve } from '../utils/webSocket'

const useGameCycles = () => {
  const state = useContext(GameStateContext)
  const dispatch = useContext(GameDispathContext)
  const router = useRouter()

  useEffect(() => {
    console.log('useGameCycles useEffect')
    if (!dispatch) return

    const gameStatusHandler = async() => {
      console.log(`gameStatus is ${state.game.status}`)
      switch(state.game.status) {
        case undefined: {
          console.log('status undefined start...')
          const { client } = await establishWsForPve({ state, dispatch })
          if (client) {
            const newState = useUpdateStateFn(state, { wsClient: client })
            if (newState) {
              dispatch({...newState})
              handleEmit(client, { event: 'prepare', gameId: 1, query: router.query })
            }
            console.log('status undefined end...')
          }
          break
        }
        case 'playing': {
          console.log('playing start...')
          break
        }
        default: break
      }
    }
    gameStatusHandler()
  },[state.game.status])
}

export { useGameCycles }