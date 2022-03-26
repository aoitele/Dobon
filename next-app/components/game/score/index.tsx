import React, { useEffect, useState } from 'react'
import { RoomAPIResponse } from '../../../@types/api/roomAPI'
import { Emit, HandleEmitFn } from '../../../@types/socket'
import { AuthState } from '../../../context/authProvider'
import { gameInitialState } from '../../../utils/game/roomStateReducer'
import styles from './index.module.scss'
import UserScore from './UserScore'
import WinCardInfo from './WinCardInfo'
import { culcBonus, culcGetScore } from '../../../utils/game/score'
import sleep from '../../../utils/game/sleep'

export interface Props {
  room: RoomAPIResponse.RoomInfo
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

interface ScoreBoardState {
  bonusCards: string[]
  bonusTotal: number
  addBonus: {
    isReverseDobon: boolean
    jokerCount: number
  }
  resultScore: number
  roundUpScore: number
  winerScore: number
  loserScore: number
  message: string
}

const initialState: ScoreBoardState = {
  bonusCards: [],
  bonusTotal: 0,
  addBonus: {
    isReverseDobon: false,
    jokerCount: 0
  },
  resultScore: 0,
  roundUpScore: 0,
  winerScore: 0,
  loserScore: 0,
  message: '',
}

const ScoreBoard:React.FC<Props> = ({ room, state, handleEmit, authUser }) => {
  const [ values, setValues ] = useState(initialState)
  const boardState = state.game.board
  const winner = boardState.users.filter(user => user.isWinner)[0]
  const loser = boardState.users.filter(user => user.isLoser)[0]
  const dobonCard = boardState.trash.card
  const isReverseDobon = state.game.event.action === 'dobonreverse'
  const bonusCards = state.game.board.bonusCards
  const extractNumRegex = (arg: string[]) => arg.join().match(/\d+/gu) 
  
  const mat = extractNumRegex([dobonCard])
  const dobonNum = mat ? Number(mat[0]) : null // 計算に使われる上がりカードの数値

  const existAddBonus = values.addBonus.isReverseDobon || values.addBonus.jokerCount > 0

  useEffect(() => {
    if (winner.id !== authUser?.id) return
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
    const bonusNums = extractNumRegex(bonusCards)?.map(_ => Number(_))

    if (winner && loser && dobonNum && bonusNums) {
      const bonusTotal = culcBonus(bonusNums)
      const resultScore = culcGetScore(dobonNum, bonusNums, false)
      const roundUpScore = Math.ceil(resultScore / 10) * 10
      const jokerCount = bonusNums.filter(card => card === 0).length

      const valueBaseObj = {
        ...values,
        bonusCards,
        bonusTotal,
        resultScore,
        roundUpScore,
        addBonus: {
          isReverseDobon,
          jokerCount
        }
      }

      setValues({
        ...valueBaseObj,
        winerScore: winner.score,
        loserScore: loser.score,
      })

      const scoreAnimation = async() => {
        await sleep(3000)
        let cntUpNum = winner.score
        const end = cntUpNum + roundUpScore
        if (cntUpNum === end) return

        const scoreCountUp = setInterval(async() => {
          cntUpNum += 1
          setValues({
            ...valueBaseObj,
            winerScore: cntUpNum,
            loserScore: loser.score - cntUpNum,
          })
          if (cntUpNum === end) {
            clearInterval(scoreCountUp)
            await sleep(1000)
            setValues({
              ...valueBaseObj,
              winerScore: cntUpNum,
              loserScore: loser.score - cntUpNum,
              message:`GoTo Next →「Game2」`
            })
            await sleep(3000)
            if (winner.id !== authUser?.id) return
            const emit:Emit = {
              roomId: room.id,
              userId: authUser?.id,
              event: 'prepare',
            }
            handleEmit(emit)
          }
        }, 10)
      }
      scoreAnimation()
    }
  },[state.game.status])

  if (!winner || !loser || !dobonCard || dobonCard.length === 0 || !dobonNum) return <></>
  
  return (
    <div className={styles.wrap}>
      {/* <ModalBack/> */}
      <div className={styles.winerInfoContainer}>
        <UserScore
          key='userScore-winer'
          user={winner}
          score={values.winerScore}
        />
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
        <UserScore 
          key='userScore-loser'
          user={loser}
          score={values.loserScore}
        />
        <div className={styles.loserScoreContainer}>
          <span>{`-${values.roundUpScore}`}</span>
        </div>
      </div>
    </div>
  )
}

export default ScoreBoard