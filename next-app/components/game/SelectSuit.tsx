import React, { Dispatch, SetStateAction, memo } from 'react'
import { InitialBoardState } from '../../@types/game'
import style from './SelectSuit.module.scss'

interface Props {
  values: InitialBoardState
  setValues: Dispatch<SetStateAction<InitialBoardState>>
}

interface SuitValues {
  suit: 's'| 'c' | 'h' | 'd'
  text: '♠'| '♣' | '❤️' | '♦'
}

const selectSuit:React.FC<Props> = ({ values, setValues }) => {
  if (values.loading) return <></>

  const suits:SuitValues[] = [
    { suit: 's', text: '♠' },
    { suit: 'c', text: '♣' },
    { suit: 'h', text: '❤️' },
    { suit: 'd', text: '♦' },
  ]

  return (
    <div className={style.wrap}>
      { suits.map(obj =>
      <span
        key={obj.suit}
        className={`${style.btn} ${values.selectedWildCard.suit === obj.suit ? style.active : ''}`}
        onClick={() => setValues({...values, selectedWildCard:{ isSelected:true, suit: obj.suit }})}
      >{obj.text}</span>
      )}
    </div>
  )
}

export default memo(selectSuit)