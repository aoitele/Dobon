/**
 * ゲーム実施状態のHooks
 */
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { BoardStateContext, BoardDispathContext } from '../../../../context/BoardProvider'
import { GameStateContext, GameDispathContext } from '../../../../context/GameProvider'
import { updateMyHandsStatus } from '../../../../utils/game/checkHand'
import { existShouldBeSolvedEffect } from '../../../../utils/game/effect'
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
        case 'showScore': {
          // const bonusCards = gameState.game.board.bonusCards
          // const bonusNums = resBonusNumArray(bonusCards)
          // const isSingleDobon = gameState.game.result.dobonHandsCount === 1
          // const bonusTotal = culcBonus(bonusNums)
          // const resultScore = culcGetScore({ dobonNum, bonusCards: bonusNums, isReverseDobon, isSingleDobon })
          // const roundUpScore = Math.ceil(resultScore / 10) * 10
          // const jokerCount = bonusNums.filter(card => card === 0).length

          // const valueBaseObj = {
          //   ...values,
          //   bonusCards,
          //   bonusTotal,
          //   resultScore,
          //   roundUpScore,
          //   addBonus: {
          //     isSingleDobon,
          //     isReverseDobon,
          //     jokerCount
          //   }
          // }

          // setValues(() => ({
          //   ...valueBaseObj,
          //   winerScore: winner.score,
          //   loserScore: loser.score,
          // }))
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
    if (gameState.game.board.turn === 1) {
      const showAvoidEffectview = gameState.game.board.effect.length > 0 && existShouldBeSolvedEffect(gameState.game.board.effect)

      boardDispatch({ ...boardState, isMyTurn: true, isDrawnCard: false, showAvoidEffectview })
      const newState = updateMyHandsStatus({ state: gameState, hands: gameState.game.board.hands, trash: gameState.game.board.trash })
      newState && gameDispatch(newState)
    } else {
      handleEmit(
        gameState.wsClient, {
          event: 'cpuTurn',
          data: {board: {data: gameState.game.board }},
          query: router.query
        }
      )
    }
  },[gameState.game.board.turn])
}

export { useGameCycles }