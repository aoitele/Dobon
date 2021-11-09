import React from 'react'
import style from './GameSet.module.scss'
interface Props {
  gameSet: number
  setCount: number
}

export const GameSet: React.FC<Props> = ({ gameSet, setCount }) => (
  <span className={style.gameset}>
     🃏{gameSet}/{setCount}🃏
  </span>
)
