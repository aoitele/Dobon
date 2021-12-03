import React, { useState } from 'react'
import { GameSet } from '../GameSet'
import UserInfo from '../UserInfo'
import { RoomAPIResponse } from '../../../@types/api/roomAPI'
import { HandleEmitFn, Emit } from '../../../@types/socket'
import style from './index.module.scss'
import { gameInitialState } from '../../../utils/game/roomStateReducer'
import { AuthState } from '../../../context/authProvider'
import Hands from '../Hands'
import spreadCardState from '../../../utils/game/spreadCardState'
import ActionBtn from '../ActionBtn'
import { SingleCard } from '../SingleCard'
import CardEffect from '../CardEffect'
import Image from 'next/image'
import turnChange from '../../../utils/game/turnChange'

interface Props {
  room: RoomAPIResponse.RoomInfo
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

const initialState: string = ''

const board = (data: Props) => {
  const [ selectedCard, setSelectedCard ] = useState(initialState)
  const { room, handleEmit, state, authUser } = data
  const boardState = state.game?.board
  const users = boardState?.users
  const me = users?.filter(_=>_.id === authUser?.id)[0]
  const turnUser = boardState && users ? users.filter(_ => _.turn === boardState.turn)[0] : null

  const putOut = (card: string) => {
    if (!boardState || !me?.id) return
    setSelectedCard(initialState)
    const emitData:Emit = {
      roomId: room.id,
      userId: me.id,
      event: 'playcard',
      data: { type: 'board', data: { trash: [`${card  }o`] }} // Trashで見せるためopenフラグをつけて送る
    }
    handleEmit(emitData)
    const newHands = boardState.hands.filter(_ => _.replace(/(o|p|op|po)/u, '') !== card)
    boardState.hands = newHands
    turnChange(boardState, room, handleEmit)
  }
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
            <UserInfo key={user.turn} user={user} otherHands={boardState.otherHands} turnUser={turnUser} />
          )
        }
      </div>
      <div className={style.boardInfo}>
        { boardState?.trash.length &&
          <SingleCard
            card = {
              Object.assign(
                spreadCardState(boardState.trash)[0],
                { style: { width:80, height: 120} }
              )
            }
          />
        }
        <div>
          { turnUser && 
              <p className={style.turnTxt}>
                <span>{turnUser?.nickname}</span> のターン
              </p>
          }
          { boardState?.effect && <CardEffect order={boardState.effect.type} value={2}/> }
        </div>
        <span onClick={() => boardState ? turnChange(boardState, room, handleEmit) : undefined }>turn change!</span>
        <div>
          <Image src={`/images/cards/deck.png`} width={70} height={105} />
          <p className={style.deckCount}>x {boardState?.deck.length}</p>
        </div>
      </div>
      {
        boardState && me && 
        <div className={style.myInfo}>
          <UserInfo key={me.turn} user={me} turnUser={turnUser}/>
        </div>
      }
      { boardState?.hands.length && <Hands cards={spreadCardState(boardState.hands, true)} putOut={putOut} selectedCard={selectedCard} setSelectedCard={setSelectedCard} /> }
      <div className={style.actionBtnWrap}>
        <ActionBtn text={'アクション'} styleClass='action'/>
        <ActionBtn text={'どぼん！'} styleClass='dobon'/>
      </div>
    </div>
  )
}
export default board