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
  console.log(state, 'state')

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
      { boardState?.hands.length && <Hands cards={spreadCardState(boardState.hands, true)} /> }
    </>
  )
}
export default board