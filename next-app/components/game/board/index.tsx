import React from 'react'
import { GameSet } from '../GameSet'
import UserInfo from '../UserInfo'
import { SingleCard } from '../SingleCard'
import CardWithCount from '../CardWithCount'
import CardEffect from '../CardEffect'
import { RoomAPIResponse } from '../../../@types/api/roomAPI'
import { HandleEmitFn } from '../../../@types/socket'
import style from './index.module.scss'
import { gameInitialState } from '../../../utils/game/roomStateReducer'
import { AuthState } from '../../../context/authProvider'

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

  return (
    <>
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
      <SingleCard suit="c" num={1} isOpen={true} />
      <SingleCard suit="c" num={2} isOpen={false} />
      <SingleCard suit="x" num={0} isOpen={true} />
      <SingleCard isOpen={false} />
      <svg width="24px" height="24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"
        />
      </svg>
      <CardWithCount
        card={[
          {
            suit: 'd',
            num: 3,
            isOpen: false
          },
          {
            suit: 'x',
            num: 1,
            isOpen: false
          },
          {
            suit: 'c',
            num: 1,
            isOpen: true
          },
          {
            suit: 'd',
            num: 1,
            isOpen: true
          }
        ]}
        numStyle="bottom"
      />
      <CardEffect order={'draw'} value={2} />
      <CardEffect order={'opencard'} value={13} />
    </>
  )
}
export default board