/**
 * ゲーム実施状態のHooks
 */
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { BoardStateContext, BoardDispathContext } from '../../../../context/BoardProvider'
import { GameStateContext, GameDispathContext } from '../../../../context/GameProvider'
import { ScoreDispathContext, ScoreProviderState, ScoreStateContext } from '../../../../context/ScoreProvider'
import { updateMyHandsStatus } from '../../../../utils/game/checkHand'
import { existShouldBeSolvedEffect } from '../../../../utils/game/effect'
import { culcBonus, culcGetScore } from '../../../../utils/game/score'
import { handleEmit } from '../../../../utils/socket/emit'
import { resBonusNumArray, resDobonNum } from '../../../game/score'
import { establishWsForPve } from '../utils/webSocket'

const useGameCycles = () => {
  const [gameState, boardState, scoreState, gameDispatch, boardDispatch, scoreDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(ScoreStateContext), useContext(GameDispathContext), useContext(BoardDispathContext), useContext(ScoreDispathContext)]
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
          const winner = gameState.game.board.users.filter(user => user.isWinner)[0]
          const loser = gameState.game.board.users.filter(user => user.isLoser)[0]
          const bonusCards = gameState.game.board.bonusCards
          const bonusNums = resBonusNumArray(bonusCards)
          const isSingleDobon = gameState.game.result.dobonHandsCount === 1
          const bonusTotal = culcBonus(bonusNums)
          const dobonNum = resDobonNum(gameState.game.board.trash.card) // 計算に使われる上がりカードの数値
          const isReverseDobon = gameState.game.event.action === 'dobonreverse'

          if (!dobonNum) return

          const resultScore = culcGetScore({ dobonNum, bonusCards: bonusNums, isReverseDobon, isSingleDobon })
          const roundUpScore = Math.ceil(resultScore / 10) * 10
          const jokerCount = bonusNums.filter(card => card === 0).length

          const newScoreState: ScoreProviderState = {
            ...scoreState,
            bonusCards,
            bonusTotal,
            resultScore,
            roundUpScore,
            winerScore: winner.score,
            loserScore: loser.score,
            addBonus: {
              isSingleDobon,
              isReverseDobon,
              jokerCount
            }
          }
          scoreDispatch && scoreDispatch(newScoreState)
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