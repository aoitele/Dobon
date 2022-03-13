import React, { useEffect, useState } from 'react'
import { RoomAPIResponse } from '../../../@types/api/roomAPI'
import { HandleEmitFn } from '../../../@types/socket'
import { AuthState } from '../../../context/authProvider'
import { gameInitialState } from '../../../utils/game/roomStateReducer'
import styles from './index.module.scss'
import UserScore from './UserScore'
import WinCardInfo from './WinCardInfo'
import { culcGetScore } from '../../../utils/game/culcGetScore'

export interface Props {
  room: RoomAPIResponse.RoomInfo
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

const initialState = {
  bonusCards: ['d11o', 'h2o', 'h13o', 'x0o'],
  bonusTotal: 0,
  squareRate: 0,
  resultScore: 0,
  winerScore: 0,
  loserScore: 0,
}

const ScoreBoard:React.FC<Props> = ({ state }) => {
  const [ values, setValues ] = useState(initialState)
  const boardState = state.game?.board
  const winner = boardState?.users.filter(_=>_.id===1)[0]
  const loser = boardState?.users.filter(_=>_.id===32)[0]
  // Const dobonCard = boardState?.trash
  const dobonCard = ['d10o']
  const extractNumRegex = (arg: string[]) => arg.join().match(/\d+/gu) 
  
  const mat = extractNumRegex(dobonCard)
  const dobonNum = mat ? Number(mat[0]) : null // 計算に使われる上がりカードの数値

  useEffect(() => {
    // ボーナスカードを取得
    const cards = values.bonusCards
    const numArray = extractNumRegex(cards)?.map(_ => Number(_))
    
    if (winner && loser && dobonNum && numArray && numArray.length > 0) {
      // スコアを計算
      const bonusTotal = numArray.reduce((acc, cur) => {
        const curNum =  cur > 10 ? 10 : cur
        return acc + curNum
      }, 0)
      const resultScore = culcGetScore(dobonNum, numArray, false)
      setValues({
        ...values,
        bonusTotal,
        resultScore,
        winerScore: winner.score,
        loserScore: loser.score
      })
    }
  },[boardState?.users])

  if (!winner || !loser || !dobonCard ||dobonCard.length === 0 || !dobonNum) return <></>
  
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
                cards={dobonCard}
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

        { values.squareRate > 0 &&
          <div className={styles.addBonus}>
            <p>・ジョーカーボーナス ×2</p>
            <p>・どぼん返し成功！ ×2</p>
          </div>
        }
        <div className={styles.winScoreContainer}>
          <span>{`= +${values.resultScore}`}</span>
        </div>
      </div>
      
      <div className={styles.loserInfoContainer}>
        <UserScore 
          key='userScore-loser'
          user={loser}
          score={values.loserScore}
        />
        <div className={styles.loserScoreContainer}>
          <span>{`-${values.resultScore}`}</span>
        </div>
      </div>
    </div>
  )
}

export default ScoreBoard