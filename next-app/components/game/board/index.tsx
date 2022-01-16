import React, { useState, useEffect } from 'react'
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
import { createEmitFnArgs } from '../../../utils/game/emit'
import { isMyTurnFn, isNextUserTurnFn } from '../../../utils/game/turnInfo'
import EffectAnimation from '../EffectAnimation'
import { createMsg } from '../../../utils/game/message'

interface Props {
  room: RoomAPIResponse.RoomInfo
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

export type initialStateType = {
  selectedCard: string
  isModalActive: boolean
  isBtnActive: {
    action: boolean
    dobon: boolean
  }
  ICan: {
    action: boolean
    dobon: boolean
  }
}
export const initialState: initialStateType = {
  selectedCard: '',
  isModalActive: false,
  isBtnActive: {
    action: false,
    dobon: false
  },
  ICan: {
    action: false,
    dobon: false
  }
}

const board = (data: Props) => {
  const [ values, setValues ] = useState(initialState)
  const { room, handleEmit, state, authUser } = data
  const boardState = state.game?.board
  const users = boardState?.users
  const me = users?.filter(_=>_.id === authUser?.id)[0]
  const turnUser = boardState && users ? users.filter(_ => _.turn === boardState.turn)[0] : null
  const isMyTurn = me && turnUser ? isMyTurnFn(me, turnUser) : false
  const isNextUserTurn = me && turnUser && users ? isNextUserTurnFn(me, turnUser, users) : false
  const isCardSelecting = values.selectedCard !== ''
  const { isBtnActive, isModalActive }  = values
  const actionBtnStyle = isMyTurn ? isBtnActive.action ? 'active' : 'action' : 'disabled'
  const dobonBtnStyle = isNextUserTurn ? 'disabled' : isBtnActive.dobon ? 'active':'dobon'

  useEffect(() => {
    // エフェクトモーダルは2秒のみ表示する
    if (values.isModalActive) {
      setTimeout(() => {
        setValues({ ...initialState, isModalActive:false })
      }, 2000)
    }
  }, [values])

  useEffect(() => {
    setValues({ ...initialState, ICan: { action: isMyTurn, dobon: !isMyTurn } })
  }, [isMyTurn])

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
    <>
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
          <ActionBtn text='アクション' styleClass={actionBtnStyle} values={values} setValues={setValues} emitArgs={boardState ? createEmitFnArgs({ boardState, room, userId: me?.id, handleEmit }): undefined } />
          <ActionBtn text='どぼん！' styleClass={dobonBtnStyle} values={values} setValues={setValues} />
        </div>
        { (isCardSelecting || isBtnActive.action) &&
          <div
            className={`${style.stateResetArea} ${isCardSelecting ? style.bg_transparent : style.bg_black}`}
            onClick={() => setValues(initialState)}
          />
        }
      </div>
      { isModalActive && me && boardState?.trash &&
        <>
          <div className={style.modalBack} />
          <EffectAnimation user={me} action={'wild'} message={createMsg({user:me, action: 'reverse', card: boardState.trash[0]})}/>
        </>
      }
    </>
  )
}
export default board