import React, { VFC } from 'react'
import Image from 'next/image'
import type { Player, OtherHands } from '../../@types/game'
import style from './UserInfo.module.scss'
import CardWithCount from './CardWithCount'
import spreadCardState from '../../utils/game/spreadCardState'
import { HaveAllPropertyCard, DevidedCardWithStatus } from '../../@types/card'
import useModal from '../../hooks/ui/useModal'
import { SingleCard } from './SingleCard'

interface Props {
  user: Player
  hands?: OtherHands
  turnUser: Player | null
}

const userInfo: React.FC<Props> = ({ user, hands, turnUser }) => {
  const { ModalDialog, open } = useModal()
  const isTurnUser = user && turnUser ? user.turn === turnUser.turn : false
  let cards:HaveAllPropertyCard[] = []
  if (hands) {
    cards = spreadCardState(hands.hands)
  }
  const cardWithStatus = cardState(cards)

  return (
  <>
  <ModalDialog>
    <OtherHandsInfo user={user} hands={cardWithStatus} />
  </ModalDialog>
    <div className={style.wrap}>
      <div className={user.isLoser ? style.loserAnimation : undefined}>
        <div className={isTurnUser ? style.iconNameOnTurn :style.iconName }>
          <Image
            src={`/images/game/userIcon/${user.turn}.png`}
            width={50}
            height={50}
          />
          <div>
            <p>{user.nickname}<span className={isTurnUser ? style.onTurnMark : undefined}>⚫︎</span></p>
            <p><span className={style.star}>⭐️</span>{user.score}</p>
          </div>
        </div>
      </div>
      { cards.length > 0 &&
      <div className={style.handInfo} onClick={() => cardWithStatus.open.length > 0 ? open() : undefined}>
        <CardWithCount
          card={cardWithStatus}
          numStyle={'bottom'}
        />
      </div>
    }
  </div>
  </>
  )
}

const cardState = (cards: HaveAllPropertyCard[]): DevidedCardWithStatus => {
  const res = {
    open: cards.filter((x) => x.isOpen),
    close: cards.filter((x) => !x.isOpen)
  }
  return res
}

interface OtherHandsInfoProps {
  user: Player
  hands: DevidedCardWithStatus
}

const OtherHandsInfo: VFC<OtherHandsInfoProps> = ({ user, hands }) => {
  return (
    <div className={style.otherHandsInfoWrap}>
      <p className={style.title}>{user.nickname}の手札</p>
      <span className={style.statusTxt}>公開中のカード👀</span>
      <div className={style.otherHands}>
        { hands.open.map(hand => <SingleCard key={`${hand.suit}${hand.num}`} card={{ ...hand, style: { width:80, height:120 } }} />) }
      </div>
      {hands.close.length > 0 &&
        <>
          <span className={style.statusTxt}>公開していないカード🙈</span>
          <div className={style.otherHands}>
            { hands.close.map(hand => <SingleCard key={`${hand.suit}${hand.num}`} card={{ ...hand, style: { width:80, height:120 } }} />) }
          </div>
        </>
      }
    </div>
  )
}


export default userInfo