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
      { boardState?.hands.length && <Hands cards={spreadCardState(boardState.hands, true)} /> }
      {
        boardState && me && 
        <div className={style.myInfo}>
          <UserInfo key={me.turn} user={me} />
        </div>
      }
      <div className={style.actionBtnWrap}>
        <ActionBtn text={'アクション'} styleClass='action'/>
        <ActionBtn text={'どぼん！'} styleClass='dobon'/>
      </div>
    </div>
  )
}
export default board