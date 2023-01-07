/**
 * ゲーム実施状態のHooks
 */
import { useContext, useEffect } from 'react'
import { GameDispathContext, GameStateContext } from '../../../../context/gameProvider'
import { useUpdateStateFn } from '../../../../utils/game/state'
import { handleEmit } from '../../../../utils/socket/emit'
import { establishWsForPve } from '../utils/webSocket'

const useGameCycles = () => {
  const state = useContext(GameStateContext)
  const dispatch = useContext(GameDispathContext)

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
            }
            handleEmit(client, { event: 'prepare' })
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