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
import Image from 'next/image'
import { createEmitFnArgs } from '../../../utils/game/emit'
import EffectAnimation from '../EffectAnimation'
import { createMsg } from '../../../utils/game/message'
import useBoardHooks from '../../../hooks/useBoardHooks'
import { existShouldBeSolvedEffect, resEffectName, isEffectCard, resNewEffectState } from '../../../utils/game/effect'
import { isModalEvent } from '../../../utils/game/event'
import ModalBack from '../../feedback/ModalBack'
import AvoidEffectSelecter from '../AvoidEffectSelecter'
import { culcBeforeUserTurn } from '../../../utils/game/turnInfo'
import SelectCardInfo from '../SelectCardInfo'
import SelectSuit from '../SelectSuit'

export interface Props {
  room: RoomAPIResponse.RoomInfo
  handleEmit: HandleEmitFn
  state: gameInitialState
  authUser: AuthState['authUser']
}

export const initialState: InitialBoardState = {
  selectedCard: '',
  selectedWildCard: {
    isSelected: false,
    suit: null
  },
  isMyTurn: false,
  isMyTurnConsecutive: false,
  isNextUserTurn: false,
  isDrawnCard: false,
  actionBtnStyle: 'disabled',
  dobonBtnStyle: 'disabled',
  isBtnActive: {
    action: false,
    dobon: false
  }
}

const board = (data: Props) => {
  const [ values, setValues ] = useState(initialState)
  const { room, handleEmit, state, authUser } = data
  if (typeof state.game === 'undefined' || !authUser) return <></>

  const boardState = state.game.board
  const users = boardState.users
  const me = users.filter(_=>_.id === authUser.id)[0]
  const turnUser = users.filter(_ => _.turn === boardState.turn)[0]
  const beforeUserTurn = boardState.turn && culcBeforeUserTurn(boardState.turn, users, boardState?.effect.includes('reverse'))
  const beforeUser = users.filter(_ => _.turn === beforeUserTurn)[0]
  const isCardSelecting = values.selectedCard !== ''
  const eventUser = state.game?.event.user

  useBoardHooks({state, values, setValues, initialState, me})

  const putOut = async(card: string) => {
    if (!boardState || !me?.id) return

    // Update trash
    let boardEmit:Emit = {
      roomId: room.id,
      userId: me.id,
      event: 'playcard',
      data: { type: 'board', data: { trash: [`${card}o`] }} // Trashで見せるためopenフラグをつけて送る
    }
    await handleEmit(boardEmit)

    // Effect notice
    const effectName = resEffectName({ card: [card], selectedWildCard: values.selectedWildCard })
    if (effectName !== '') {
      const actionEmit: Emit = {
        roomId: room.id,
        userId: me.id,
        event: 'effectcard',
        user: me,
        data: { type:'action', data: { effectState:boardState.effect, effect:effectName } }
      }
      await handleEmit(actionEmit)
    }


    /**
     * Update BoardState Effect
     * 盤面に残っている効果と出したカードの効果を相殺し、更新版のeffectを送る
     * 対象となる効果は「draw(2/4/6)」「wild」「reverse」「opencard」
     */
    const existsEffect = boardState.effect.length > 0
    if (!existsEffect && effectName !== '') {
      boardEmit = {
        roomId: room.id,
        event: 'effectupdate',
        data: { type:'board', data: { effect: [effectName] } }
      }
    }

    if (existsEffect) {
      const newEffectState = resNewEffectState(boardState.effect, effectName)
      boardEmit = {
        roomId: room.id,
        event: 'effectupdate',
        data: { type:'board', data: { effect: newEffectState } }
      }
    }
    await handleEmit(boardEmit)
    boardEmit = {
      roomId: room.id,
      userId: me.id,
      event: 'turnchange',
      data: {
        type:'board',
        data: { users, turn: boardState.turn, trash: [`${card}o`], effect: boardState.effect },
        option: { values: { isMyTurnConsecutive: values.isMyTurnConsecutive }, triggered: 'putOut' }
      }
    }
    await handleEmit(boardEmit)
    // 参加者2人でskipが出た場合は自分のターンとなる
    const isNextUserIsMe = boardState.users.length === 2 && effectName === 'skip'
    const newValues:InitialBoardState = isNextUserIsMe
    ? { ...initialState, isMyTurn: true, isMyTurnConsecutive:true, actionBtnStyle: 'draw' }
    : { ...initialState, isNextUserTurn: true }
    setValues(newValues)
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
              user => authUser.id !== user.id &&
              <UserInfo
                key={`user_${user.id}_info`}
                user={user}
                hands={boardState.otherHands.filter(_=>_.userId === user.id)[0]} turnUser={turnUser}
              />
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
            <div className={style.effectWrap}>
              { boardState?.effect && 
              <>
                { boardState.effect.includes('reverse') && <span className={style.reverse}>🔄</span> }
                { boardState.effect.includes('wildspade') && <span className={style.wildSuit}>♠️</span> }
                { boardState.effect.includes('wildclub') && <span className={style.wildSuit}>♣️</span> }
                { boardState.effect.includes('wilddia') && <span className={style.wildSuit}>♦️</span> }
                { boardState.effect.includes('wildheart') && <span className={style.wildSuit}>♥️</span> }
                { boardState.effect.includes('joker') && <span className={style.joker}>🃏</span> }
                { boardState.effect.includes('draw2') &&
                  <div className={style.drawCardInfo}>
                    <div>
                      <span className={style.icon}>🃏</span>
                      <span className={style.count}>×2</span>
                    </div>
                  </div>
                }
                { boardState.effect.includes('opencard') && <span className={style.openCardIcon}>👑</span> }
              </>
              }
            </div>
          </div>
          <div>
            <Image src={`/images/cards/deck.png`} width={70} height={105} />
            <p className={style.deckCount}>x {boardState?.deckCount}</p>
          </div>
        </div>
        { isEffectCard({
          card:[values.selectedCard],
          isMyCard:true
        })
        ? <SelectCardInfo states={{values}}/>
        : boardState && me &&
          <div className={style.myInfo}>
            <UserInfo key='my_info' user={me} turnUser={turnUser} />
          </div>
        }
        { boardState.hands.length &&
        <div className={style.handsWrap}>
          <div className={style.slides}>
          { spreadCardState(boardState.hands, true).map(card =>
            <Hands
              key={`${card.num}${card.suit}`}
              states={{
                card,
                values
              }}
              functions={{putOut, setValues}}
            />
          )}
          </div>
        </div>
        }
        { values.selectedWildCard.isSelected
        ? <SelectSuit
            states={{ values }}
            functions={{ setValues }}
          />
        : boardState && me &&
          <div className={style.actionBtnWrap}>
            <ActionBtn
              key={'btn__action'}
              text={values.isDrawnCard ? 'スキップ' : boardState.deckCount === 0 ? 'デッキセット＆ドロー' : 'ドロー'}
              styleClass={values.actionBtnStyle}
              values={values}
              setValues={setValues}
              isMyTurn={values.isMyTurn}
              emitArgs={boardState ? createEmitFnArgs({ boardState, room, user:me, userId: me.id, handleEmit, options:{ values: { isMyTurnConsecutive: values.isMyTurnConsecutive }, triggered:'actionBtn'} }): undefined
            } />
            <ActionBtn
              key={'btn__dobon'}
              text='どぼん！'
              styleClass={values.dobonBtnStyle}
              values={values}
              setValues={setValues}
              isMyTurn={values.isMyTurn}
              emitArgs={boardState ? createEmitFnArgs({ boardState, room, user:me, userId: me.id, handleEmit }): undefined
            } />
          </div>
        }
        { boardState.effect.includes('joker') && <div className={style.hint}><span className={style.hintTxt}>{`手札合計21でどぼん可能！`}</span></div> }

        { isCardSelecting &&
          <div
            className={`${style.stateResetArea} ${isCardSelecting ? style.bg_transparent : style.bg_black}`}
            onClick={() => setValues({
              ...values,
              selectedCard: '',
              actionBtnStyle: values.actionBtnStyle === 'skip' ? 'skip' : 'draw',
              dobonBtnStyle: values.actionBtnStyle === 'skip' || values.isMyTurnConsecutive ? 'disabled' : 'dobon',
              isBtnActive: { action:false, dobon: false },
              selectedWildCard: {
                isSelected: false,
                suit: null
              }
            })
            }
          />
        }
      </div>
      { eventUser && state.game && isModalEvent(state.game.event.action) && boardState?.trash &&
        <>
          <ModalBack />
          <EffectAnimation
            user={eventUser}
            action={state.game.event.action}
            message={createMsg({action: state.game.event.action, card: boardState.trash[0]})}
          />
        </>
      }
      { boardState && values.isMyTurn && state.game.board.effect.length > 0 && existShouldBeSolvedEffect(state.game.board.effect) &&
      <AvoidEffectSelecter
        states={{
          state,
          authUser,
          emitter:beforeUser,
          effect:state.game.board.effect,
          cards:spreadCardState(boardState.hands, true),
          values,
          turnUser,
        }}
        functions={{ handleEmit, setValues, putOut}}
      /> }
    </>
  )
}
export default board