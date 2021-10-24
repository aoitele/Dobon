import React, { useReducer } from 'react'
import Image from 'next/image'
import type {
  HaveAllPropertyCard,
  DevidedCardWithStatus
} from '../../@types/card'
import style from './CardWithCount.module.scss'
import reducer from '../../utils/game/cardWithCountReducer'

interface Cards {
  card: HaveAllPropertyCard[]
  numStyle: 'bottom' | 'right'
}

const setState = (cards: HaveAllPropertyCard[]): DevidedCardWithStatus => {
  const res = {
    open: cards.filter((x) => x.isOpen),
    close: cards.filter((x) => !x.isOpen)
  }
  return res
}

const CardWithCount: React.FC<Cards> = ({ card, numStyle }) => {
  const initialState = setState(card)
  const [state] = useReducer(reducer, initialState)
  const cardCount = card.length
  const existOpenCard = state.open.length > 0
  let suit = null
  let num = null
  if (existOpenCard) {
    ;({ suit, num } = state.open[0])
  }
  return (
    <div className={numStyle === 'bottom' ? style.wrapBottom : style.wrapRight}>
      {existOpenCard ? (
        <Image src={`/images/cards/${suit}${num}.png`} width={40} height={60} />
      ) : (
        <Image
          src="/images/cards/z.png"
          width={40}
          height={60}
          className={style.cardImage}
        />
      )}
      <div className={style.cardCountWrap}>
        <span className={style.cardCount}>×{cardCount}</span>
      </div>
    </div>
  )
}

export default CardWithCount
