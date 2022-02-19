import React, { memo } from 'react'
import style from './GameSet.module.scss'
interface Props {
  gameSet: number
  setCount: number
}

// eslint-disable-next-line react/display-name
export const GameSet:React.FC<Props> = memo(({ gameSet, setCount }) => <span className={style.gameset}>🃏{gameSet}/{setCount}🃏</span>)
