import React, { VFC } from 'react'
import { HandCards } from '../../../@types/card'
import spreadCardState from '../../../utils/game/spreadCardState'
import { SingleCard } from '../SingleCard'
import styles from './WinCardInfo.module.scss'

interface Props {
  cards: string[] | HandCards[]
  message: string
}

const WinCardInfo:VFC<Props> = ({ cards, message }) => {
  if (cards.length === 0) return <></>

  return(
    <div className={styles.winCardInfo}>
      {/* 1枚の場合と複数枚の場合でスタイルを変えるため、別々に出力 */}
      {
        cards.length === 1 &&
        <SingleCard
            key={`winCard`}
            card = {
              Object.assign(
                spreadCardState(cards)[0],
                { style: { width:80, height: 120} }
              )
            }
          />
      }
      <div className={styles.bonusCardContainer}>
      { cards.length >= 2 && cards.map((card, idx) => 
          <div key={`winCardDiv-${idx}`} className={styles.bonusCard}>
            <SingleCard
              key={`winCard-${idx}`}
              card = {
                Object.assign(
                  spreadCardState([card])[0],
                  { style: { width:80, height: 120} }
                )
              }
            />
          </div>
      ) }
      </div>
      <p className={styles.winNumText}>{message}</p>
    </div>
  )
}

export default WinCardInfo