/**
 * ゲーム実施状態のHooks
 */
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { BoardStateContext, BoardDispathContext } from '../../../../context/BoardProvider'
import { GameStateContext, GameDispathContext } from '../../../../context/GameProvider'
import { useUpdateStateFn } from '../../../../utils/game/state'
import { handleEmit } from '../../../../utils/socket/emit'
import { establishWsForPve } from '../utils/webSocket'

const useGameCycles = () => {
  const gameState = useContext(GameStateContext)
  const boardState = useContext(BoardStateContext)
  const gameDispatch = useContext(GameDispathContext)
  const boardDispatch = useContext(BoardDispathContext)

  const router = useRouter()

  useEffect(() => {
    console.log('useGameCycles useEffect')
    if (!gameDispatch || !boardDispatch) return

    const gameStatusHandler = async() => {
      console.log(`gameStatus is ${gameState.game.status}`)
      switch(gameState.game.status) {
        case undefined: {
          console.log('status undefined start...')
          const { client } = await establishWsForPve({ state: gameState, dispatch: gameDispatch })
          if (client) {
            const newState = useUpdateStateFn(gameState, { wsClient: client })
            if (newState) {
              gameDispatch({...newState})
              handleEmit(client, { event: 'prepare', gameId: 1, query: router.query })
            }
            console.log('status undefined end...')
          }
          break
        }
        case 'playing': {
          console.log('playing start...')
          boardDispatch({ ...boardState, isMyTurn: true })
          break
        }
        default: break
      }
    }
    gameStatusHandler()
  },[gameState.game.status])
}

export { useGameCycles }