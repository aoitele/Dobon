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
import { emit, createEmitFnArgs } from '../../../utils/game/emit'

interface Props {
  room: RoomAPIResponse.RoomInfo
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

export type initialStateType = {
  selectedCard: string
  isBtnActive: boolean
}
export const initialState: initialStateType = {
  selectedCard: '',
  isBtnActive: false
}

const board = (data: Props) => {
  const [ values, setValues ] = useState(initialState)
  const { room, handleEmit, state, authUser } = data
  const boardState = state.game?.board
  const users = boardState?.users
  const me = users?.filter(_=>_.id === authUser?.id)[0]
  const turnUser = boardState && users ? users.filter(_ => _.turn === boardState.turn)[0] : null

  const putOut = async(card: string) => {
    if (!boardState || !me?.id) return
    setValues(initialState)
    let emitData:Emit = {
      roomId: room.id,
      userId: me.id,
      event: 'playcard',
      data: { type: 'board', data: { trash: [`${card}o`] }} // Trashで見せるためopenフラグをつけて送る
    }
    await handleEmit(emitData)

    emitData = {
      roomId: room.id,
      userId: me.id,
      event: 'turnchange',
      data: { type:'board', data: { users, turn: boardState.turn }}
    }
    await handleEmit(emitData)
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
            <UserInfo key={`user_${user.id}_info`} user={user} otherHands={boardState.otherHands} turnUser={turnUser} />
          )
        }
      </div>
      <div className={style.boardInfo}>
        { boardState?.trash.length &&
          <SingleCard
            key='trash'
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
        <span onClick={
          () => boardState
          ? emit(createEmitFnArgs({ boardState, room, userId: me?.id, event: 'turnchange', handleEmit }))
          : undefined
        }>turn change!</span>
        <div>
          <Image src={`/images/cards/deck.png`} width={70} height={105} />
          <p className={style.deckCount}>x {boardState?.deck.length}</p>
        </div>
      </div>
      {
        boardState && me && 
        <div className={style.myInfo}>
          <UserInfo key='my_info' user={me} turnUser={turnUser}/>
        </div>
      }
      { boardState?.hands.length && <Hands cards={spreadCardState(boardState.hands, true)} putOut={putOut} selectedCard={values.selectedCard} setSelectedCard={setValues} /> }
      <div className={style.actionBtnWrap}>
        <ActionBtn text={'アクション'} styleClass='action' isBtnActive={values.isBtnActive} setValues={setValues} emitArgs={boardState ? createEmitFnArgs({ boardState, room, userId: me?.id, handleEmit }): undefined}/>
        <ActionBtn text={'どぼん！'} styleClass='dobon' isBtnActive={values.isBtnActive} setValues={setValues} />
      </div>
    </div>
  )
}
export default board