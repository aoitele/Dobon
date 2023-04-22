/**
 * ゲーム実施状態のHooks
 */
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { EmitForPVE } from '../../../../@types/socket'
import { BoardStateContext, BoardDispathContext, boardProviderInitialState } from '../../../../context/BoardProvider'
import { GameStateContext, GameDispathContext } from '../../../../context/GameProvider'
import { ScoreDispathContext, ScoreProviderState, ScoreStateContext, scoreProviderInitialState } from '../../../../context/ScoreProvider'
import { updateMyHandsStatus } from '../../../../utils/game/checkHand'
import { existShouldBeSolvedEffect } from '../../../../utils/game/effect'
import { culcBonus, culcGetScore } from '../../../../utils/game/score'
import sleep from '../../../../utils/game/sleep'
import { useUpdateStateFn } from '../../../../utils/game/state'
import { handleEmit } from '../../../../utils/socket/emit'
import { resBonusNumArray, resDobonNum } from '../../../game/score'
import { establishWsForPve } from '../utils/webSocket'

const useGameCycles = () => {
  const [gameState, boardState, scoreState, gameDispatch, boardDispatch, scoreDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(ScoreStateContext), useContext(GameDispathContext), useContext(BoardDispathContext), useContext(ScoreDispathContext)]
  const router = useRouter()

  useEffect(() => {
    if (!gameDispatch || !boardDispatch) return

    const gameStatusHandler = async() => {
      switch(gameState.game.status) {
        case undefined: {
          const { client } = await establishWsForPve({ dispatch: gameDispatch })
          if (client) {
            const newState = {...gameState, wsClient: client}
            gameDispatch({ ...newState })
            handleEmit(client, { event: 'prepare', gameId: 1, query: router.query })
          }
          break
        }
        case 'playing': {
          // TODO：敗者がturn:1になるようにした時にここは修正が必要
          boardDispatch({ ...boardState, isMyTurn: true })
          break
        }
        case 'showScore': {
          if (!scoreDispatch) return

          const winner = gameState.game.board.users.filter(user => user.isWinner)[0]
          const loser = gameState.game.board.users.filter(user => user.isLoser)[0]
          const bonusCards = gameState.game.board.bonusCards
          const bonusNums = resBonusNumArray(bonusCards)
          const isSingleDobon = gameState.game.result.dobonHandsCount === 1
          const bonusTotal = culcBonus(bonusNums)
          const dobonNum = resDobonNum(gameState.game.board.trash.card) // 計算に使われる上がりカードの数値
          const isReverseDobon = gameState.game.result.isReverseDobon

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
              isReverseDobon: Boolean(isReverseDobon),
              jokerCount
            }
          }
          scoreDispatch(newScoreState);
          const newGameState = useUpdateStateFn(gameState, { game: { board: { waitDobon: false } } })
          gameDispatch(newGameState); // 盤面状態を初期化

          (async() => {
            await sleep(2000)
            let i = 0

            const scoreCountUp = setInterval(async() => {
              i += 1
              scoreDispatch({
                ...newScoreState,
                winerScore: winner.score + i,
                loserScore: loser.score - i,
              })
              if (i === roundUpScore) {
                clearInterval(scoreCountUp)
                // スコア更新
                const postProcessEmit:EmitForPVE = {
                  event: 'postprocess',
                  data: {
                    board: {
                      data: {
                        users: [{ nickname: winner.mode ? winner.nickname : 'me', score: winner.score + i }, { nickname: loser.nickname, score: loser.score - i }]
                      }
                    }
                  }
                }
                handleEmit(gameState.wsClient, postProcessEmit )

                const nextGameId = gameState.game.id ? gameState.game.id + 1 : null
                await sleep(1000)
                scoreDispatch(() => ({
                  ...newScoreState,
                  winerScore: winner.score + i,
                  loserScore: loser.score - i,
                  message:`GoTo Next →「Game${nextGameId}」`
                }))
                await sleep(1000)
                handleEmit(gameState.wsClient, { event: 'prepare', gameId: nextGameId, query: router.query, data: { board: {data: { speed: gameState.game.board.speed }}} }) // ゲームスピードの選択状態は維持させる
                scoreDispatch(scoreProviderInitialState) // ScoreBoardの状態をリセット(次ゲーム終了時の表示を初期状態に戻すため)
                boardDispatch(boardProviderInitialState) // boardStateの状態をリセット(次ゲーム終了時の表示を初期状態に戻すため)
              }
            }, 10)
          })()
          break
        }
        default: break
      }
    }
    gameStatusHandler()
  },[gameState.game.status])

  // board.statusに関するフック
  useEffect(() => {
    const emitBoard:EmitForPVE = { event: null, query: router.query, data: { board: { data: gameState.game.board } } }

    switch(gameState.game.board.status) {
      case 'dobonCheck': {
        handleEmit(gameState.wsClient, {...emitBoard, event: 'cpuDobon'})
        break
      }
      case 'playing': {
      if (gameState.game.board.turn === 1) {
        const showAvoidEffectview = gameState.game.board.effect.length > 0 && existShouldBeSolvedEffect(gameState.game.board.effect)
        boardDispatch?.({ ...boardState, isMyTurn: true, isDrawnCard: false, showAvoidEffectview })
        const newState = updateMyHandsStatus({ state: gameState, hands: gameState.game.board.hands, trash: gameState.game.board.trash })
        newState && gameDispatch?.(newState)
      } else {
        handleEmit(gameState.wsClient, {...emitBoard, event: 'cpuTurn'})
      }
        break
      }
      case 'turnChanging': {
        /**
         * ターン変更はプレイヤー、CPUどちらもこのボードステータスを経由して実行させる
         * スキップ or カードを出した際にallowDobonも切り替えておき、turnchangeイベント側処理の条件分岐に利用させる
         */
        handleEmit(
          gameState.wsClient, {
            event: 'turnchange',
            data: {
              board: {
                data: gameState.game.board,
                option:{ 
                  values: { selectedWildCard: boardState.selectedWildCard },
                  triggered: gameState.game.board.allowDobon ? 'putOut' : 'actionBtn'
                }
              }
            }
          }
        )

        // ターン終了時に自分のカード選択状態などを初期化させる
        boardDispatch?.(boardProviderInitialState)
        break;
      }
      default: break
    }

  }, [gameState.game.board.status])

  // game.event.actionに関するフック
  useEffect(() => {
    const { action } = gameState.game.event

    switch (action) {
      case 'wildclub' :
      case 'wilddia'  :
      case 'wildheart':
      case 'wildspade': {
        // PVE戦ではCPUが柄選択をした場合の選択柄情報がturnChange処理まで渡せないため、プレイヤーのboardtStateを利用して柄選択を反映している
        const isCpuTurn = gameState.game.board.turn !== 1
        const selectedSuit =
        action === 'wildclub' ? 'c' :
        action === 'wilddia' ? 'd' :
        action === 'wildheart' ? 'h' : 's' as ('c' | 'd' | 'h' | 's')

        if (isCpuTurn) {
          boardDispatch?.({ ...boardState, selectedWildCard:{isSelected: true, suit: selectedSuit } })
        }
        break
      }
      default: break
    }

  },[gameState.game.event.action])
}

export { useGameCycles }