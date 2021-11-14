import React from 'react'
import Image from 'next/image'
import type { Player, OtherHands } from '../../@types/game'
import style from './UserInfo.module.scss'
import CardWithCount from './CardWithCount'
import spreadCardState from '../../utils/game/spreadCardState'
import { HaveAllPropertyCard } from '../../@types/card'
import hasProperty from '../../utils/function/hasProperty'

interface Props {
  user: Player
  otherHands?: OtherHands[]
}

const userInfo: React.FC<Props> = ({ user, otherHands }) => {
  const hand = otherHands ? otherHands.filter(_ => _.userId === user.id)[0] : []
  let hands: HaveAllPropertyCard[] = []

  if (hasProperty(hand,'hands')) {
    hands = spreadCardState(hand.hands)
  }
  return (
    <div className={style.wrap}>
      <div className={style.iconName}>
        <Image
          src={`/images/game/userIcon/${user.turn}.png`}
          width={50}
          height={50}
        />
        <div>
          <p>{user.nickname}</p>
          <p>score：{user.score}</p>
        </div>
      </div>
      { hands.length > 0 &&
      <div className={style.handInfo}>
        <CardWithCount
          card={hands}
          numStyle={'bottom'}
        />
      </div>
    }
  </div>
  )
}

export default userInfo