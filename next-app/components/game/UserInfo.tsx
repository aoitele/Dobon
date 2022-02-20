import React from 'react'
import Image from 'next/image'
import type { Player, OtherHands } from '../../@types/game'
import style from './UserInfo.module.scss'
import CardWithCount from './CardWithCount'
import spreadCardState from '../../utils/game/spreadCardState'
import { HaveAllPropertyCard, DevidedCardWithStatus } from '../../@types/card'

interface Props {
  user: Player
  hands?: OtherHands
  turnUser: Player | null
}

const userInfo: React.FC<Props> = ({ user, hands, turnUser }) => {
  const isTurnUser = user && turnUser ? user.turn === turnUser.turn : false
  let cards:HaveAllPropertyCard[] = []
  if (hands) {
    cards = spreadCardState(hands.hands)
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
      { cards.length > 0 &&
      <div className={style.handInfo}>
        <CardWithCount
          card={cardState(cards)}
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