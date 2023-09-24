import React, { VFC } from 'react'
import style from './UserScore.module.scss'
import { Player } from '../../../@types/game'

interface Props {
  user: Player
  score?: number
  roundUpScore?: number
  imgSize?: number
}
const UserScore:VFC<Props> = ({ user, score, imgSize }) => {
  return (
    <div className={style.wrap}>
      <img
        src={`/images/game/userIcon/${user.turn}.png`}
        width={imgSize ?? 80}
        height={imgSize ?? 80}
      />
      <div>
        <p><span className={style.nickname}>{user.nickname}</span></p>
        {/* scoreStateにユーザースコアの初期値がセットされてから出力させる */}
        {typeof score === 'number' && <p><span className={style.star}>⭐️</span>{score}</p>}
      </div>
    </div>
  )
}

export default UserScore