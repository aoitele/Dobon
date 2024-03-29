import React, { useState, useEffect } from 'react'
import { Order } from '../../@types/game'
import { Event } from '../../@types/socket'
import type { Rank, RankCardNum, RankCardText } from '../../@types/card'
import styles from './CardEffect.module.scss'

interface Props {
  order: Event
  value: RankCardNum
}

interface UnTreatEffect {
  order: Extract<Order, 'draw2' | 'draw4' | 'draw6' | 'draw8' | 'opencard' | null>
}

const CardEffect: React.FC<Props> = ({ order, value }) => {
  const [untreatEffect] = useState<UnTreatEffect>({ order: null })
  const [drawNum, setDrawNum] = useState(
    Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO)
  )
  const rankCards: Rank = {
    0: 'ジョーカー(ワイルド、21でドボン可能)',
    1: 'スキップ',
    2: 'ドローカード+2',
    8: 'ワイルド',
    11: 'リバース',
    13: '手札公開'
  }
  const effectText: RankCardText = rankCards[value]

  useEffect(() => {
    if (untreatEffect.order && order === 'draw') {
      setDrawNum(drawNum + Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO))
    }
  }, [order])

  return (
    <div className={styles.wrap}>
      <div className={styles.effectText}>{effectText}</div>
    </div>
  )
}

export default CardEffect
