import React from 'react'
import { GameSet } from '../GameSet'
import UserInfo from '../UserInfo'
import { RoomAPIResponse } from '../../../@types/api/roomAPI'
import { HandleEmitFn } from '../../../@types/socket'
import style from './index.module.scss'
import { gameInitialState } from '../../../utils/game/roomStateReducer'
import { AuthState } from '../../../context/authProvider'
import Hands from '../Hands'
import spreadCardState from '../../../utils/game/spreadCardState'
import ActionBtn from '../ActionBtn'
import { SingleCard } from '../SingleCard'
import CardEffect from '../CardEffect'
import Image from 'next/image'

interface Props {
  room: RoomAPIResponse.RoomInfo
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

const board = (data: Props) => {
  const { room, state, authUser } = data
  const boardState = state.game?.board
  const users = boardState?.users
  const me = users?.filter(_=>_.id === authUser?.id)[0]

  return (
    <div className={style.wrap}>
      <div className={style.roomInfo}>
        <h1 className={style.title}>{room.title}</h1>
        <GameSet gameSet={state.game?.id ? state.game.id : 1} setCount={room.set_count} />
      </div>
      <div className={style.userInfoWrap}>
        {
          boardState && users &&
          users.map(
            user => authUser?.id !== user.id &&
            <UserInfo key={user.turn} user={user} otherHands={boardState.otherHands}/>
          )
        }
      </div>
      <div className={style.boardInfo}>
        { boardState?.trash.length &&
          <SingleCard
            card = {
              Object.assign(
                spreadCardState(boardState.trash.slice(-1))[0],
                { style: { width:80, height: 120} }
              )
            }
          />
        }
        <div>
          <p className={style.turnTxt}><span>たろう</span> のターン</p>
          <CardEffect order={'draw'} value={2}/>
        </div>
        <div>
          <Image src={`/images/cards/deck.png`} width={70} height={105} />
          <p className={style.deckCount}>x {boardState?.deck.length}</p>
        </div>
      </div>
      {
        boardState && me && 
        <div className={style.myInfo}>
          <UserInfo key={me.turn} user={me} />
        </div>
      }
      { boardState?.hands.length && <Hands cards={spreadCardState(boardState.hands, true)} /> }
      <div className={style.actionBtnWrap}>
        <ActionBtn text={'アクション'} styleClass='action'/>
        <ActionBtn text={'どぼん！'} styleClass='dobon'/>
      </div>
    </div>
  )
}
export default board