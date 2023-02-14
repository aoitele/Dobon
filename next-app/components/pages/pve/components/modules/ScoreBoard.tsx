import React, { useContext, useEffect, useState } from "react"
import { GameStateContext } from "../../../../../context/GameProvider"
import { handleEmit } from "../../../../../utils/socket/emit"
import { createInitialState, resDobonNum } from "../../../../game/score"
import styles from '../../../../game/score/index.module.scss'
import UserScore from "../../../../game/score/UserScore"
import WinCardInfo from "../../../../game/score/WinCardInfo"

const ScoreBoard = () => {
  const [gameState] = [useContext(GameStateContext)]

  const winner = gameState.game.board.users.filter(user => user.isWinner)[0]
  const loser = gameState.game.board.users.filter(user => user.isLoser)[0]
  const [ values, setValues ] = useState(createInitialState(winner, loser))
  const dobonCard = gameState.game.board.trash.card
  // const isReverseDobon = gameState.game.event.action === 'dobonreverse'
  // const bonusCards = gameState.game.board.bonusCards
  const dobonNum = resDobonNum(dobonCard) // 計算に使われる上がりカードの数値
  const existAddBonus = values.addBonus.isReverseDobon || values.addBonus.isSingleDobon || values.addBonus.jokerCount > 0

  useEffect(() => {
    // ボーナスカード取得
    (async() => {
      await handleEmit(gameState.wsClient, { event: 'getbonus' })
      setValues({
        ...values,
        bonusCards: gameState.game.board.bonusCards
      })
    })()
  },[])

  return (
      <div className={styles.wrap}>
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