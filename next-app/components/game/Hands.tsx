import React from 'react'
import { SingleCard } from './SingleCard'
import { HaveAllPropertyCard } from '../../@types/card'
import style from './Hands.module.scss'

interface Cards {
  cards: HaveAllPropertyCard[]
}

const hands: React.FC<Cards> = ({ cards }) => {
  return (
  <div className={style.wrap}>
    <div className={style.slides}>
      { cards && cards.map(_ =>
      <div key={`${_.suit}${_.num}_slide`} className={style.slide}>
        {
        <div className={_.isPutable ? '' : style.cantPut}>
          <SingleCard
            key={`${_.suit}${_.num}`}
            card={{
              suit: _.suit,
              num: _.num,
              isOpen: true,
              isPutable: _.isPutable,
              style: {
                width:160,
                height:240
              }
            }}/>
          </div>
        }
      </div>
        ) }
    </div>
  </div>
  )
}

export default hands
