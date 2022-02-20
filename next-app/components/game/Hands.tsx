import React from 'react'
import Image from 'next/image'
import { SingleCard } from './SingleCard'
import { HaveAllPropertyCard } from '../../@types/card'
import { InitialBoardState } from '../../@types/game'
import style from './Hands.module.scss'

interface Props {
  states: {
    cards: HaveAllPropertyCard[]
    values: InitialBoardState
    selectedCard: string
  }
  functions: {
    putOut: (card: string) => Promise<void> // eslint-disable-line no-unused-vars
    setValues: React.Dispatch<React.SetStateAction<InitialBoardState>>
  }
}
  
const hands: React.FC<Props> = ({ states, functions}) => {
  const { cards, values, selectedCard } = states
  const { putOut, setValues } = functions

  return (
  <div className={style.wrap}>
    <div className={style.slides}>
      { cards && cards.map(_ =>
      <>
        <div key={`${_.suit}${_.num}_slide`} className={style.slide}>
          <div
            className={`${style.card} ${_.isPutable ? '' : style.cantPut} ${selectedCard === `${_.suit}${_.num}` ? style.selected : '' }`}
            onClick={ selectedCard === `${_.suit}${_.num}` ? () => putOut(`${_.suit}${_.num}`) : undefined }
          >
            <div className={style.effectEye}>{ _.isOpen && <Image src={`/images/game/effect/eye.png`} width={15} height={15} />}</div>
            <SingleCard
              key={`hands-${_.suit}${_.num}`}
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
              values={values}
              setValues={setValues}
            />
            { selectedCard === `${_.suit}${_.num}` && <span>⚫︎</span>}
          </div>
        </div>
      </>
      ) }
    </div>
  </div>
  )
}

export default hands
