import React, { useState } from 'react'
import { SingleCard } from './SingleCard'
import { HaveAllPropertyCard } from '../../@types/card'
import style from './Hands.module.scss'

interface Cards {
  cards: HaveAllPropertyCard[]
  putOut: any
}
const initialState: string = ''
  
const hands: React.FC<Cards> = ({ cards, putOut }) => {
  const [ selectedCard, setSelectedCard ] = useState(initialState)
  return (
  <div className={style.wrap}>
    <div className={style.slides}>
      { cards && cards.map(_ =>
      <div key={`${_.suit}${_.num}_slide`} className={style.slide}>
        {
        <div
        className={`${_.isPutable ? '' : style.cantPut} ${selectedCard === `${_.suit}${_.num}` ? style.selected : '' }`}
        onClick={ selectedCard === `${_.suit}${_.num}` ? () => putOut(`${_.suit}${_.num}o`) : undefined }
        >
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
            }}
            setSelectedCard={setSelectedCard}
            />
          </div>
        }
        { selectedCard === `${_.suit}${_.num}` && <span>⚫︎</span>}
      </div>
        ) }
    </div>
  </div>
  )
}

export default hands
