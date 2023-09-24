/**
 * ゲーム実施状態のHooks
 */
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { Player } from '../../../../@types/game'
import { EmitForPVE } from '../../../../@types/socket'
import { BoardStateContext, BoardDispathContext, boardProviderInitialState } from '../../../../context/BoardProvider'
import { GameStateContext, GameDispathContext } from '../../../../context/GameProvider'
import { ScoreDispathContext, ScoreProviderState, ScoreStateContext, scoreProviderInitialState } from '../../../../context/ScoreProvider'
import { gameInitialState } from '../../../../context/state/gameInitialState'
import { updateMyHandsStatus } from '../../../../utils/game/checkHand'
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
          /**
           * スコア計算
           * 勝者が1人で敗者が複数いる場合、最終スコアは「獲得スコア×敗者の人数」となる
           * 勝者の合計値を敗者で分配負担させる
           */
          const winner = gameState.game.board.users.filter(user => user.isWinner)
          const loser = gameState.game.board.users.filter(user => user.isLoser)
          const bonusCards = gameState.game.board.bonusCards
          const bonusNums = resBonusNumArray(bonusCards)
          const isSingleDobon = gameState.game.result.dobonHandsCount === 1
          const bonusTotal = culcBonus(bonusNums)
          const dobonNum = resDobonNum(gameState.game.board.trash.card) // 計算に使われる上がりカードの数値
          const isReverseDobon = gameState.game.result.isReverseDobon
          const existMultiLoser = loser.length > 1

          if (!dobonNum) return

          const resultScore = culcGetScore({ dobonNum, bonusCards: bonusNums, isReverseDobon, isSingleDobon, winner, loser })
          let roundUpScore = Math.ceil(resultScore / 10) * 10
          const jokerCount = bonusNums.filter(card => card === 0).length

          // 複数名が敗者となった場合、スコア×人数分のスコアを獲得する
          if (winner.length === 1 && existMultiLoser) {
            roundUpScore *= loser.length
          }

          const newScoreState: ScoreProviderState = {
            ...scoreState,
            bonusCards,
            bonusTotal,
            resultScore,
            roundUpScore,
            winner,
            loser,
            addBonus: {
              isSingleDobon,
              isReverseDobon: Boolean(isReverseDobon),
              jokerCount
            }
          }
          scoreDispatch(newScoreState);

          (async() => {
            await sleep(2000)
            let i = 0
            const loseScorePerPlayer = roundUpScore * winner.length / loser.length

            const scoreCountUp = setInterval(async() => {
              i += 2 // アニメーションの速度となる
              const isReachLoseScoreCount = loseScorePerPlayer <= i

              scoreDispatch({
                ...newScoreState,
                winner: winner.map(w => ({...w, score: w.score + i})),
                loser: loser.map(l => ({...l, score: isReachLoseScoreCount ? l.score - loseScorePerPlayer : l.score - i}))
              })
              if (i === roundUpScore) {
                clearInterval(scoreCountUp)
                // スコア更新があるユーザーのデータを送る
                const updateUserScores: Pick<Player, 'nickname' | 'score' | 'isCpu'>[] = [...winner, ...loser].map(player => {
                  return {
                    nickname: player.isCpu ? player.nickname : 'me',
                    score: player.isWinner ? player.score + i : existMultiLoser ? player.score - loseScorePerPlayer : player.score - i,
                    isCpu: player.isCpu,
                   }
                })
                const postProcessEmit:EmitForPVE = {
                  event: 'postprocess',
                  data: {
                    board: {
                      data: {
                        users: updateUserScores
                      }
                    }
                  }
                }
                handleEmit(gameState.wsClient, postProcessEmit )

                const isLastGame = gameState.game.id === gameState.game.setCount
                const nextGameId = gameState.game.id ? gameState.game.id + 1 : null
                await sleep(1000)

                if (isLastGame) {
                  // 最終ゲームであればスコア情報を更新、結果画面へ移行させる
                  const updatedUsers = gameState.game.board.users.map(user => {
                    const newScore = user.isCpu
                      ? updateUserScores.find(u => u.nickname === user.nickname)?.score
                      : updateUserScores.find(u => !u.isCpu)?.score // nonCPUはログインユーザーの場合もあるためnicknameチェックは通さない
                    if (typeof newScore === 'number') {
                      user.score = newScore
                    }
                    return user
                  })
                  // game.boardの状態をリセット(次ゲーム開始時の表示を初期状態に戻すため。スピードは引き継ぐ)
                  const newGameState = useUpdateStateFn(gameState, { game: { ...gameInitialState.game, status: 'gameSet', board: { ...gameInitialState.game.board, users: updatedUsers, speed: gameState.game.board.speed } } })
                  gameDispatch({...newGameState})
                  scoreDispatch(scoreProviderInitialState) // ScoreBoardの状態をリセット(次ゲーム開始時の表示を初期状態に戻すため)
                  boardDispatch(boardProviderInitialState) // boardStateの状態をリセット(次ゲーム開始時の表示を初期状態に戻すため)
                  return
                }

                const message = nextGameId === gameState.game.setCount ? 'GoTo Next → Last Game' : `GoTo Next →「Game${nextGameId}」`
                scoreDispatch(prevState => ({ ...prevState, message }))
                await sleep(1000)
                handleEmit(gameState.wsClient, { event: 'prepare', gameId: nextGameId, query: router.query, data: { board: {data: { speed: gameState.game.board.speed }}} }) // ゲームスピードの選択状態は維持させる
                boardDispatch(boardProviderInitialState) // boardStateの状態をリセット(次ゲーム終了時の表示を初期状態に戻すため)
                await sleep(1000) // スコアステートを初期化すると一瞬初期状態がちらつくため、初期化前に画面を次ゲームに入らせる
                scoreDispatch(scoreProviderInitialState) // ScoreBoardの状態をリセット(次ゲーム終了時の表示を初期状態に戻すため)
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
        boardDispatch?.({ ...boardState, isMyTurn: true, isDrawnCard: false })
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
      case 'effectResolving': {
        boardDispatch?.({ ...boardState, showAvoidEffectview: true })
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