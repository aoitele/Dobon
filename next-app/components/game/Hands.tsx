import React from 'react'
import Image from 'next/image'
import { SingleCard } from './SingleCard'
import { HaveAllPropertyCard } from '../../@types/card'
import { InitialBoardState } from '../../@types/game'
import style from './Hands.module.scss'
import DobonConst from '../../constant'

interface Props {
  states: {
    card: HaveAllPropertyCard
    values: InitialBoardState
  }
  functions: {
    putOut: (card: string) => Promise<void> // eslint-disable-line no-unused-vars
    setValues: React.Dispatch<React.SetStateAction<InitialBoardState>>
  }
}
  
const hands: React.FC<Props> = ({ states, functions}) => {
  const { card, values } = states
  const { setValues } = functions

  return (
    <div className={style.slides}>
      <div key={`${card.suit}${card.num}_slide`}>
        <div
          className={`${style.card} ${card.isPutable ? '' : style.cantPut} ${values.selectedCard === `${card.suit}${card.num}` ? style.selected : '' }`}
          onClick={() => cardOnClickFn(states, functions)}
        >
          <div className={style.effectEye}>{ card.isOpen && <Image src={`/images/game/effect/eye.png`} width={15} height={15} />}</div>
          <SingleCard
            key={`hands-${card.suit}${card.num}`}
            card={{
              suit: card.suit,
              num: card.num,
              isOpen: true,
              isPutable: card.isPutable,
              style: {
                width:160,
                height:240
              }
            }}
            values={values}
            setValues={setValues}
          />
          { values.selectedCard === `${card.suit}${card.num}` && <span>⚫︎</span>}
        </div>
      </div>
    </div>
  )
}

const cardOnClickFn = (states: Props['states'], functions: Props['functions']) => {
  const { card, values } = states
  const { putOut } = functions
  if (card.num === DobonConst.DOBON_CARD_NUMBER_WILD) return undefined // 8は柄選択によってputOutするため
  if (values.selectedCard === `${card.suit}${card.num}`) return putOut(`${card.suit}${card.num}`)
  return undefined
}

export default hands
