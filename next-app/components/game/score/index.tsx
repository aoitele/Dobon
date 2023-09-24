import React, { useEffect, useState } from 'react'
import { RoomAPIResponse } from '../../../@types/api/roomAPI'
import { Emit, HandleEmitFn } from '../../../@types/socket'
import { AuthState } from '../../../context/AuthProvider'
import { gameInitialState } from '../../../utils/game/roomStateReducer'
import styles from './index.module.scss'
import UserScore from './UserScore'
import WinCardInfo from './WinCardInfo'
import { culcBonus, culcGetScore } from '../../../utils/game/score'
import sleep from '../../../utils/game/sleep'
import { DOBON_JUDGE_NUMBER_JOKER } from '../../../constant'
import { Player } from '../../../@types/game'

export interface Props {
  room: RoomAPIResponse['roomInfo']
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

export interface ScoreBoardState {
  bonusCards: string[]
  bonusTotal: number
  addBonus: {
    isSingleDobon: boolean
    isReverseDobon: boolean
    jokerCount: number
  }
  resultScore: number
  roundUpScore: number
  winer: Player[]
  loser: Player[]
  message: string
}

export const createInitialState = (winner: Player[], loser: Player[]) => {
  const initialState: ScoreBoardState = {
    bonusCards: [],
    bonusTotal: 0,
    addBonus: {
      isSingleDobon: false,
      isReverseDobon: false,
      jokerCount: 0
    },
    resultScore: 0,
    roundUpScore: 0,
    winer: winner,
    loser,
    message: '',
  }
  return initialState
}


const ScoreBoard:React.FC<Props> = ({ room, state, handleEmit, authUser }) => {
  const boardState = state.game.board
  const winner = boardState.users.filter(user => user.isWinner)
  const loser = boardState.users.filter(user => user.isLoser)
  const [ values, setValues ] = useState(createInitialState(winner, loser))

  const dobonCard = boardState.trash.card
  const isReverseDobon = state.game.result.isReverseDobon
  const bonusCards = state.game.board.bonusCards
  const dobonNum = resDobonNum(dobonCard) // 計算に使われる上がりカードの数値
  const existAddBonus = values.addBonus.isReverseDobon || values.addBonus.isSingleDobon || values.addBonus.jokerCount > 0
  const existMultiLoser = loser.length > 1

  useEffect(() => {
    if (winner[0].id !== authUser?.id) return
    // ゲームの勝者がボーナスカード取得のリクエストを実行する
    const reqBonusCards = async() => {
      const emit:Emit = {
        roomId: room.id,
        userId: authUser?.id,
        event: 'getbonus',
      }
      await handleEmit(emit)
      setValues({
        ...values,
        bonusCards: state.game.board.bonusCards
      })
    }
    reqBonusCards()
  },[])

  useEffect(() => {
    if (state.game.status !== 'showScore') return
    const bonusNums = resBonusNumArray(bonusCards)
    const isSingleDobon = state.game.result?.dobonHandsCount === 1

    if (winner && loser && dobonNum && bonusNums) {
      const bonusTotal = culcBonus(bonusNums)
      const resultScore = culcGetScore({ dobonNum, bonusCards: bonusNums, isReverseDobon, isSingleDobon, winner, loser })
      const jokerCount = bonusNums.filter(card => card === 0).length
      let roundUpScore = Math.ceil(resultScore / 10) * 10

      // 複数名が敗者となった場合、スコア×人数分のスコアを獲得する
      if (winner.length === 1 && existMultiLoser) {
        roundUpScore *= loser.length
      }

      const valueBaseObj = {
        ...values,
        bonusCards,
        bonusTotal,
        resultScore,
        roundUpScore,
        addBonus: {
          isSingleDobon,
          isReverseDobon : Boolean(isReverseDobon),
          jokerCount
        }
      }

      setValues(() => ({
        ...valueBaseObj,
        winer: winner,
        loser,
      }))

      let i = 0
      const loseScorePerPlayer = roundUpScore * winner.length / loser.length

      const scoreAnimation = async() => {
        await sleep(3000)       
        const scoreCountUp = setInterval(async() => {
          i += 1
          const isReachLoseScoreCount = loseScorePerPlayer <= i

          setValues(() => ({
            ...valueBaseObj,
            winer: winner.map(w => ({...w, score: w.score + i})),
            loser: loser.map(l => ({...l, score: isReachLoseScoreCount ? l.score - loseScorePerPlayer : l.score - i})),
          }))
          if (i === roundUpScore) {
            clearInterval(scoreCountUp)

            /**
             * ゲームの勝者にスコア更新を実行させる
             * スコア更新があるユーザーのデータを送る
             */
            if (winner[0].id === authUser?.id) {
              const updateUserScores: Pick<Player, 'id' | 'score'>[] = [...winner, ...loser].map(player => {
                return {
                  id: player.id,
                  score: player.isWinner ? player.score + i : existMultiLoser ? player.score - loseScorePerPlayer : player.score - i,
                }
              })
              const postProcessEmit:Emit = {
                roomId: room.id,
                event: 'postprocess',
                data: {
                  type: 'board',
                  data: {
                    users: updateUserScores
                  }
                }
              }
              handleEmit(postProcessEmit)
            }

            const nextGameId = state.game.id ? state.game.id + 1 : null
            await sleep(1000)
            const message = nextGameId === state.game.setCount ? 'GoTo Next → Last Game' : `GoTo Next →「Game${nextGameId}」`
            setValues(prevState => ({ ...prevState, message }))
            await sleep(1000)

            if (winner[0].id === authUser?.id) {
              const emit: Emit = {
                roomId: room.id,
                gameId: nextGameId,
                userId: authUser?.id,
                event: 'prepare',
              }
              handleEmit(emit)
              await sleep(1000) // スコアステートを初期化すると一瞬初期状態がちらつくため、初期化前に画面を次ゲームに入らせる
              setValues(createInitialState([], [])) // ScoreBoardの状態をリセット(次ゲーム終了時の表示を初期状態に戻すため)
            }
          }
        }, 10)
      }
      scoreAnimation()
    }
  },[state.game.status])

  if (!winner || !loser || !dobonCard || dobonCard.length === 0) return <></>
  
  return (
    <div className={styles.wrap}>
      <div className={styles.winerInfoContainer}>
        {winner.map(player => {
          const winnerScore = values.winer.filter(w => w.id === player.id)[0].score;
          return (
            <UserScore
              key='userScore-winer'
              user={player}
              score={winnerScore}
            />
          )
        })}
        <span className={styles.heading}>どぼん成功！</span>

        <div className={styles.winAndBonusInfoContainer}>
          <div className={styles.winAndBonusInfo}>
            <div className={styles.winCardInfoContainer}>
              <WinCardInfo 
                key='winCardInfo-dobon'
                cards={[dobonCard]}
                message={`上がり値\n「${dobonNum}」`}
              />
            </div>
            <div className={styles.productMark}>
              <span>✖️</span>
            </div>
            <div className={styles.winCardInfoContainer}>
              <WinCardInfo 
                key='winCardInfo-bonus'
                cards={values.bonusCards}
                message={`ボーナス\n「${values.bonusTotal}」`}
              />
            </div>
          </div>
        </div>
        { existAddBonus &&
          <div className={styles.addBonus}>
            { values.addBonus.jokerCount > 0 && <p>ジョーカーボーナス ×{values.addBonus.jokerCount * 2}</p> }
            { values.addBonus.isSingleDobon && <p>単騎どぼんボーナス ×2</p> }
            { values.addBonus.isReverseDobon && <p>どぼん返し成功！ ×2</p> }
          </div>
        }
        <div className={styles.winScoreContainer}>
          <span>{`= +${values.roundUpScore}`}</span>
        </div>
        <p className={styles.resultScore}>(roundUp : {values.resultScore} )</p>
      </div>

      {values.message.length > 0 &&
        <div className={styles.NextGameInfo}>
          <span>{values.message}</span>
        </div>
      }
      
      <div className={styles.loserInfoContainer}>
        {loser.map(player => {
          const loserScore = values.loser.filter(l => l.id === player.id)[0].score;
          return (
            <UserScore
              key='userScore-loser'
              user={player}
              score={loserScore}
            />
          )
        })}
        <div className={styles.loserScoreContainer}>
          <span>{`-${values.roundUpScore}`}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 上がり計算のドボン値に利用する数字を算出させる
 */
export const resDobonNum = (dobonCard: string) => {
  if (['x0o', 'x1o'].includes(dobonCard)) return DOBON_JUDGE_NUMBER_JOKER
  const num = dobonCard.match(/\d+/gu)
  if (num === null) return null
  return Number(num[0])
}

/**
 * 上がり計算のボーナス値に利用する数字を算出させる
 * jokerは0として返却させる
 * (スコア計算ではjocker=0として利用するためx1o -> x0oに置き換えている)
 * @param arg '[s1o, s2o, x1o, ...]'
 * @returns [1, 2, 0, ...]
 */

export const resBonusNumArray = (bonusCards: string[]): number[] => {
  const _bonusCards = bonusCards.map(card => card === 'x1o' ? 'x0o' : card)
  const joinedStr = _bonusCards.join()
  const mat = joinedStr.match(/\d+/gu)
  if (mat === null) return []
  return mat.map(_ => Number(_))
}

export default ScoreBoard