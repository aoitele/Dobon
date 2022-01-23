import React, { useState } from 'react'
import { GameSet } from '../GameSet'
import UserInfo from '../UserInfo'
import { RoomAPIResponse } from '../../../@types/api/roomAPI'
import { HandleEmitFn, Emit } from '../../../@types/socket'
import { InitialBoardState } from '../../../@types/game'
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
import EffectAnimation from '../EffectAnimation'
import { createMsg } from '../../../utils/game/message'
import useBoardHooks from '../../../hooks/useBoardHooks'

export interface Props {
  room: RoomAPIResponse.RoomInfo
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

export const initialState: InitialBoardState = {
  selectedCard: '',
  isMyTurn: false,
  isNextUserTurn: false,
  isDrawnCard: false,
  actionBtnStyle: 'disabled',
  dobonBtnStyle: 'disabled',
  isModalActive: false,
  isBtnActive: {
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
  const isCardSelecting = values.selectedCard !== ''
  const eventUser = state.game?.event.user

  useBoardHooks({state, values, setValues, initialState, me})

  const putOut = async(card: string) => {
    if (!boardState || !me?.id) return
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
    setValues({ ...initialState, isNextUserTurn: true })
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
            <p className={style.deckCount}>x {boardState?.deckCount}</p>
          </div>
        </div>
        {
          boardState && me &&
          <div className={style.myInfo}>
            <UserInfo key='my_info' user={me} turnUser={turnUser}/>
          </div>
        }
        { boardState?.hands.length && <Hands cards={spreadCardState(boardState.hands, true)} putOut={putOut} selectedCard={values.selectedCard} values={values} setValues={setValues} /> }
        { boardState && me &&
          <div className={style.actionBtnWrap}>
            <ActionBtn text={values.isDrawnCard ? 'スキップ' : boardState.deckCount === 0 ? 'デッキセット＆ドロー' : 'ドロー'} styleClass={values.actionBtnStyle} values={values} setValues={setValues} isMyTurn={values.isMyTurn} emitArgs={boardState ? createEmitFnArgs({ boardState, room, user:me, userId: me.id, handleEmit }): undefined } />
            <ActionBtn text='どぼん！' styleClass={values.dobonBtnStyle} values={values} setValues={setValues} isMyTurn={values.isMyTurn} emitArgs={boardState ? createEmitFnArgs({ boardState, room, user:me, userId: me.id, handleEmit }): undefined } />
          </div>
        }
        { (isCardSelecting || values.isBtnActive.action) &&
          <div
            className={`${style.stateResetArea} ${isCardSelecting ? style.bg_transparent : style.bg_black}`}
            onClick={() => setValues({
              ...values,
              selectedCard: '',
              actionBtnStyle: values.actionBtnStyle === 'skip' ? 'skip' : 'draw',
              dobonBtnStyle: values.actionBtnStyle === 'skip' ? 'disabled' : 'dobon',
              isBtnActive: { action:false, dobon: false }})
            }
          />
        }
      </div>
      { boardState?.trash && eventUser && values.isModalActive &&
        <>
          <div className={style.modalBack} />
          <EffectAnimation user={eventUser} action={'dobon'} message={createMsg({action: 'dobon', card: boardState.trash[0]})}/>
        </>
      }
    </>
  )
}
export default board