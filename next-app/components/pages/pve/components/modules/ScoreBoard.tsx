import React, { useContext, useEffect } from "react"
import { GameStateContext } from "../../../../../context/GameProvider"
import { ScoreDispathContext, ScoreStateContext } from "../../../../../context/ScoreProvider"
import { handleEmit } from "../../../../../utils/socket/emit"
import { resDobonNum } from "../../../../game/score"
import styles from '../../../../game/score/index.module.scss'
import UserScore from "../../../../game/score/UserScore"
import WinCardInfo from "../../../../game/score/WinCardInfo"

const ScoreBoard = () => {
  const [gameState, scoreState, scoreDispatch] = [useContext(GameStateContext), useContext(ScoreStateContext), useContext(ScoreDispathContext)]

  const winner = gameState.game.board.users.filter(user => user.isWinner)[0]
  const loser = gameState.game.board.users.filter(user => user.isLoser)[0]
  const dobonCard = gameState.game.board.trash.card
  const dobonNum = resDobonNum(dobonCard) // 計算に使われる上がりカードの数値
  const existAddBonus = scoreState.addBonus.isReverseDobon || scoreState.addBonus.isSingleDobon || scoreState.addBonus.jokerCount > 0

  useEffect(() => {
    // ボーナスカード取得
    (async() => {
      await handleEmit(gameState.wsClient, { event: 'getbonus' })
      scoreDispatch && scoreDispatch({
        ...scoreState,
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
            score={scoreState.winerScore}
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
                  cards={scoreState.bonusCards}
                  message={scoreState.bonusTotal > 0 ? `ボーナス\n「${scoreState.bonusTotal}」` : ''}
                />
              </div>
            </div>
          </div>
          { existAddBonus &&
            <div className={styles.addBonus}>
              { scoreState.addBonus.jokerCount > 0 && <p>ジョーカーボーナス ×{scoreState.addBonus.jokerCount * 2}</p> }
              { scoreState.addBonus.isSingleDobon && <p>単騎どぼんボーナス ×2</p> }
              { scoreState.addBonus.isReverseDobon && <p>どぼん返し成功！ ×2</p> }
            </div>
          }
          <div className={styles.winScoreContainer}>
            <span>{`= +${scoreState.roundUpScore}`}</span>
          </div>
          <p className={styles.resultScore}>(roundUp : {scoreState.resultScore} )</p>
        </div>
  
        {scoreState.message.length > 0 &&
          <div className={styles.NextGameInfo}>
            <span>{scoreState.message}</span>
          </div>
        }
        
        <div className={styles.loserInfoContainer}>
          <UserScore 
            key='userScore-loser'
            user={loser}
            score={scoreState.loserScore}
          />
          <div className={styles.loserScoreContainer}>
            <span>{`-${scoreState.roundUpScore}`}</span>
          </div>
        </div>
      </div>
  )
}


export default ScoreBoard