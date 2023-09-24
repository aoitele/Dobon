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

  const winner = gameState.game.board.users.filter(user => user.isWinner)
  const loser = gameState.game.board.users.filter(user => user.isLoser)
  const dobonCard = gameState.game.board.trash.card
  const dobonNum = resDobonNum(dobonCard) // 計算に使われる上がりカードの数値
  const existAddBonus = scoreState.addBonus.isReverseDobon || scoreState.addBonus.isSingleDobon || scoreState.addBonus.jokerCount > 0
  const existMultiWinner = winner.length > 1
  const existMultiLoser = loser.length > 1
  const loserMinusScore = scoreState.roundUpScore * winner.length / loser.length
  const dobonDesc = gameState.game.result.isReverseDobon
    ? 'どぼん返し\n成功！'
    : existMultiWinner
      ?  winner.length === 2
        ? 'ダブルどぼん成功！'
        : 'トリプルどぼん成功！'
      : 'どぼん成功！'
  const getScoreDesc = winner.length === 1 && existMultiLoser
  ? `(${scoreState.roundUpScore / loser.length} × ${loser.length})`
  : `(roundUp : ${scoreState.resultScore} )`

  useEffect(() => {
    // ボーナスカード取得
    (async() => {
      await handleEmit(gameState.wsClient, { event: 'getbonus' })
      scoreDispatch?.({
        ...scoreState,
        bonusCards: gameState.game.board.bonusCards
      })
    })()
  },[])

  return (
      <div className={styles.wrap}>
        <div className={styles.winerInfoContainer}>
          <div className={existMultiWinner ? styles.winerScoreWrapMultiWin : styles.winerScoreWrap}>
            {winner.map(user => {
              const winerScore = scoreState.winner?.find(u => u.turn === user.turn)?.score
              return (
                <UserScore
                  key={`userScore-winner-${user.turn}`}
                  user={user}
                  score={winerScore}
                  imgSize={existMultiWinner ? 60 : undefined}
                />
              )}
            )}
          </div>
          <span className={existMultiWinner ? styles.headingMultiWin : styles.heading}>{dobonDesc}</span>
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
            <span>{`+${scoreState.roundUpScore}`}<span className={styles.resultScore}> {getScoreDesc}</span></span>
          </div>
        </div>
        <div className={styles.loserInfoContainer}>
          <div className={existMultiLoser ? styles.loserScoreWrapMultiLose : styles.loserScoreWrap}>
            {loser.map(user => {
              const loserScore = scoreState.loser?.find(u => u.turn === user.turn)?.score
              return (
                <UserScore
                  key={`userScore-loser-${user.turn}`}
                  user={user}
                  score={loserScore}
                  imgSize={loser.length > 1 ? 60 : undefined}
                />
              )
            })}
             <div className={styles.loserScoreContainer}>
              <span>{`-${loserMinusScore}`}</span>
            </div>
          </div>
          {scoreState.message.length > 0 &&
            <div className={styles.NextGameInfo}>
              <span>{scoreState.message}</span>
            </div>
          }
        </div>
      </div>
  )
}


export default ScoreBoard