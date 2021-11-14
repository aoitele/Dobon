import React from 'react'
import { SingleCard } from './SingleCard'
import { HaveAllPropertyCard } from '../../@types/card'
import style from './Hands.module.scss'

interface Cards {
  cards: HaveAllPropertyCard[]
}

const hands: React.FC<Cards> = ({ cards }) => {
  const showScrollBtn = cards.length > 4
  return (
  <div className={style.wrap}>
    { showScrollBtn ? <span className={style.scrollBtn}> ◀️ </span> : <></>}
    <div className={style.slides}>
      { cards && cards.map(_ =>
      <div key={`${_.suit}${_.num}_slide`} className={style.slide}>
        <SingleCard key={`${_.suit}${_.num}`} suit={_.suit} num={_.num} isOpen={_.isOpen} style={{ width:150, height:225 }}/>
      </div>
        ) }
    </div>
    { showScrollBtn ? <span className={style.scrollBtn}> ▶︎ </span> : <></>}
  </div>
  )
}

export default hands
