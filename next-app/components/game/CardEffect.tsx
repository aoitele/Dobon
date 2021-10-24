import React, { useState, useEffect } from 'react'
import type { Order } from '../../@types/game'
import type { Rank, RankCardNum, RankCardText } from '../../@types/card'
import styles from './CardEffect.module.scss'

interface Props {
  order: Order
  value: RankCardNum
}

interface UnTreatEffect {
  order: Extract<Order, 'draw' | 'opencard' | null>
}

const CardEffect: React.FC<Props> = ({ order, value }) => {
  const [untreatEffect] = useState<UnTreatEffect>({ order: null })
  const [drawNum, setDrawNum] = useState(
    Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO)
  )
  const rankCards: Rank = {
    0: 'JockerFree',
    1: 'Skip',
    2: '+DrawTwo',
    8: 'SelectSuit',
    11: 'ElevenBack',
    13: 'OpenCard'
  }
  const effectText: RankCardText = rankCards[value]
  const avoidableCards = [
    Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO),
    Number(process.env.NEXT_PUBLIC_RANK_CARD_OPENCARD)
  ]
  const showAvoidBtn = value && avoidableCards.includes(value)

  useEffect(() => {
    if (untreatEffect.order && order === 'draw') {
      setDrawNum(drawNum + Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO))
    }
  }, [order])

  return (
    <div className={styles.wrap}>
      <div className={styles.effectText}>{effectText}</div>
      {showAvoidBtn && (
        <div className={styles.avoidBtn}>
          <span>AvoidEffect</span>
        </div>
      )}
    </div>
  )
}

export default CardEffect
