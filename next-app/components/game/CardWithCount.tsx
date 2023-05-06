import React from 'react'
import { HaveAllPropertyCard } from '../../@types/card'
import style from './CardWithCount.module.scss'

export interface CardWithCountProps {
  card: {
    open: HaveAllPropertyCard[]
    close: HaveAllPropertyCard[]
  }
  numStyle: 'bottom' | 'right'
}

/**
 * 表示する内容
 * クローズカードのみ：裏面カード×枚数
 * オープンカードのみ：表面カード×枚数(柄数は最初の1枚)
 * 両方ある場合：裏面カード×枚数＆表面カード×枚数
 */
type HandPattern = 'close' | 'open' | 'both'

const CardWithCount: React.FC<CardWithCountProps> = ({ card, numStyle }) => {
  const { open, close } = card
  const olen = open.length
  const clen = close.length
  const cardCount = olen + clen
  const pattern:HandPattern = cardCount === olen ? 'open' : cardCount === clen ? 'close' : 'both'
  let num = null
  let suit = null
  if (pattern !== 'close') {
    num = open[0].num
    suit = open[0].suit
  }

  return (
    <div className={numStyle === 'bottom' ? style.wrapBottom : style.wrapRight}>
      { pattern === 'both' &&
        <>
          <CardImageWithCount
            isOpen={false}
            count={clen}
            />
          <CardImageWithCount
            isOpen={true}
            count={olen}
            suit={suit}
            num={num}
          />
        </>
      }
      { pattern === 'open' &&
        <CardImageWithCount
          isOpen={true}
          count={olen}
          suit={suit}
          num={num}
        /> }
      { pattern === 'close' &&
        <CardImageWithCount
          isOpen={false}
          count={clen}
        /> }
    </div>
  )
}

interface CardImageWithCountProps {
  isOpen: boolean
  count: number
  suit?:HaveAllPropertyCard['suit']
  num?:HaveAllPropertyCard['num']
}

const CardImageWithCount: React.FC<CardImageWithCountProps> = ({isOpen, count, suit, num}) => {

  return (
    <>
      <div className={style.wrap}>
        <img
          src={isOpen ? `/images/cards/${suit}${num}.png` : "/images/cards/z.png"}
          width={40}
          height={60}
          className={style.cardImage}
        />
        <div className={style.cardCountWrap}>
          <span className={style.cardCount}>×{count}</span>
        </div>
      </div>
    </>
  )
}

export default CardWithCount
