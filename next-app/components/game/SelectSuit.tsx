import React from 'react'
import { InitialBoardState } from '../../@types/game'
import style from './SelectSuit.module.scss'

interface Props {
  states: {
    values: InitialBoardState
  }
  functions: {
    setValues: React.Dispatch<React.SetStateAction<InitialBoardState>>
  }
}

interface SuitValues {
  suit: 's'| 'c' | 'h' | 'd'
  text: '♠'| '♣' | '❤️' | '♦'
}

const selectSuit:React.FC<Props> = ({ states, functions }) => {
  const { values } = states
  const { selectedWildCard } = values
  const { setValues } = functions

  const suits:SuitValues[] = [
    { suit: 's', text: '♠' },
    { suit: 'c', text: '♣' },
    { suit: 'h', text: '❤️' },
    { suit: 'd', text: '♦' },
  ]

  return (
    <div className={style.wrap}>
      { suits.map(_ =>
      <span
        key={_.suit}
        className={`${style.btn} ${selectedWildCard.suit === _.suit ? style.active : ''}`}
        onClick={() => setValues({...values, selectedWildCard:{ isSelected:true, suit: _.suit }})}
      >{_.text}</span>
      )}
    </div>
  )
}


export default selectSuit