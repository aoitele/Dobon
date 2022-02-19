import React from 'react'
import Image from 'next/image'
import type { Player, OtherHands } from '../../@types/game'
import style from './UserInfo.module.scss'
import CardWithCount from './CardWithCount'
import spreadCardState from '../../utils/game/spreadCardState'
import { HaveAllPropertyCard, DevidedCardWithStatus } from '../../@types/card'
import hasProperty from '../../utils/function/hasProperty'

interface Props {
  user: Player
  otherHands?: OtherHands[]
  turnUser: Player | null
}

const userInfo: React.FC<Props> = ({ user, otherHands, turnUser }) => {
  const hand = otherHands ? otherHands.filter(_ => _.userId === user.id)[0] : []
  let hands: HaveAllPropertyCard[] = []
  const isTurnUser = user && turnUser ? user.turn === turnUser.turn : false

  if (hasProperty(hand,'hands')) {
    hands = spreadCardState(hand.hands)
  }
  return (
    <div className={style.wrap}>
      <div className={isTurnUser ? style.iconNameOnTurn :style.iconName }>
        <Image
          src={`/images/game/userIcon/${user.turn}.png`}
          width={50}
          height={50}
        />
        <div>
          <p>{user.nickname}<span className={ isTurnUser ? style.onTurnMark : '' }>⚫︎</span></p>
          <p><span className={style.star}>⭐️</span>{user.score}</p>
        </div>
      </div>
      { hands.length > 0 &&
      <div className={style.handInfo}>
        <CardWithCount
          card={cardState(hands)}
          numStyle={'bottom'}
        />
      </div>
    }
  </div>
  )
}

const cardState = (cards: HaveAllPropertyCard[]): DevidedCardWithStatus => {
  const res = {
    open: cards.filter((x) => x.isOpen),
    close: cards.filter((x) => !x.isOpen)
  }
  return res
}

export default userInfo