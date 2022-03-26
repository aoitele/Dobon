import React, { VFC } from 'react'
import Image from 'next/image'
import style from './UserScore.module.scss'
import { Player } from '../../../@types/game'

interface Props {
  user: Player
  score: number
  roundUpScore?: number
}
const UserScore:VFC<Props> = ({ user, score }) => {
  return (
    <div className={style.wrap}>
      <Image
        src={`/images/game/userIcon/${user.turn}.png`}
        width={80}
        height={80}
      />
      <div>
        <p><span className={style.nickname}>{user.nickname}</span></p>
        <p><span className={style.star}>⭐️</span>{score}</p>
      </div>
    </div>
  )
}

export default UserScore