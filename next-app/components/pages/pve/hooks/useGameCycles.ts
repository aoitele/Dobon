/**
 * ゲーム実施状態のHooks
 */
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { BoardStateContext, BoardDispathContext } from '../../../../context/BoardProvider'
import { GameStateContext, GameDispathContext } from '../../../../context/GameProvider'
import { handleEmit } from '../../../../utils/socket/emit'
import { establishWsForPve } from '../utils/webSocket'

const useGameCycles = () => {
  const [gameState, boardState, gameDispatch, boardDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(GameDispathContext), useContext(BoardDispathContext)]
  const router = useRouter()

  useEffect(() => {
    console.log('useGameCycles useEffect')
    if (!gameDispatch || !boardDispatch) return

    const gameStatusHandler = async() => {
      console.log(`gameStatus is ${gameState.game.status}`)
      switch(gameState.game.status) {
        case undefined: {
          console.log('status undefined start...')
          const { client } = await establishWsForPve({ dispatch: gameDispatch })
          if (client) {
            const newState = {...gameState, wsClient: client}
            gameDispatch({ ...newState })
            handleEmit(client, { event: 'prepare', gameId: 1, query: router.query })
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

  useEffect(() => {
    if (!gameDispatch || !boardDispatch) return
    console.log('turnChanged')
    if (gameState.game.board.turn !== 1) {
      handleEmit(
        gameState.wsClient, {
          event: 'cpuTurn',
          data:{ type:'board', data: gameState.game.board },
          query: router.query
        }
      )
    } else {
      boardDispatch({ ...boardState, isMyTurn: true, isDrawnCard: false })
    }
  },[gameState.game.board.turn])
}

export { useGameCycles }