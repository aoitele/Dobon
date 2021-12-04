import React from 'react'
import { SingleCard } from './SingleCard'
import { HaveAllPropertyCard } from '../../@types/card'
import { initialStateType } from './board/index'
import style from './Hands.module.scss'

interface Cards {
  cards: HaveAllPropertyCard[]
  putOut: any
  selectedCard: string
  setSelectedCard: React.Dispatch<React.SetStateAction<initialStateType>>
}
  
const hands: React.FC<Cards> = ({ cards, putOut, selectedCard, setSelectedCard }) => {
  return (
  <div className={style.wrap}>
    <div className={style.slides}>
      { cards && cards.map(_ =>
      <div key={`${_.suit}${_.num}_slide`} className={style.slide}>
        {
        <div
        className={`${style.card} ${_.isPutable ? '' : style.cantPut} ${selectedCard === `${_.suit}${_.num}` ? style.selected : '' }`}
        onClick={ selectedCard === `${_.suit}${_.num}` ? () => putOut(`${_.suit}${_.num}`) : undefined }
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
