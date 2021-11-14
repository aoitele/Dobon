import React from 'react'
import { SingleCard } from './SingleCard'
import { HaveAllPropertyCard } from '../../@types/card'
import style from './Hands.module.scss'

interface Cards {
  cards: HaveAllPropertyCard[]
}

const hands: React.FC<Cards> = ({ cards }) => {
  console.log(cards, 'test')
  const showMoreBtn = cards.length > 4
  return (
  <div className={style.wrap}>
    { showMoreBtn ? <span className={style.scrollBtn}> ◀️ </span> : <></>}
    { cards && cards.map(_ => <SingleCard key={`${_.suit}${_.num}`} suit={_.suit} num={_.num} isOpen={_.isOpen} style={{ width:60, height:90 }}/>) }
    { showMoreBtn ? <span className={style.scrollBtn}> ▶︎ </span> : <></>}
  </div>
  )
}

export default hands
