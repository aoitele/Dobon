/**
 * 解決すべきカード効果が場に発生した時のポップアップ
 */
import React, { useState } from 'react'
import { InitialBoardState, Player, SolvableEffects, Board, Effect } from '../../@types/game'
import { extractShouldBeSolvedEffect, resEffectNumber } from '../../utils/game/effect'
import { resMyHandsCardNumbers } from '../../utils/game/checkHand'
import styles from './AvoidEffectSelecter.module.scss'
import { SingleCard } from './SingleCard'
import spreadCardState from '../../utils/game/spreadCardState'
import { Emit, HandleEmitFn } from '../../@types/socket'
import { gameInitialState } from '../../utils/game/roomStateReducer'
import Hands from './Hands'
import { HaveAllPropertyCard } from '../../@types/card'
import UserInfo from './UserInfo'
import { emit, Props } from '../../utils/game/emit'
import { addEmitArgEvent } from './ActionBtn'
import { AuthAPIResponse } from '../../@types/api/authAPI'

interface AvoidEffectProps {
  states:{
    state: gameInitialState
    authUser: AuthAPIResponse.UserMe
    emitter: Player
    effect: SolvableEffects
    cards: HaveAllPropertyCard[]
    values: InitialBoardState
    turnUser: Player
  }
  functions: {
    handleEmit: HandleEmitFn
    setValues: React.Dispatch<React.SetStateAction<InitialBoardState>>
    putOut: (card: string) => Promise<void> // eslint-disable-line no-unused-vars
  }
  emitArgs?: Props
}

interface UserHandsInfoProps {
  users: Player[]
  authUser: AuthAPIResponse.UserMe
}

const initialState = {
  cardSelectMode: false,
  handsInspectMode: false
}

const avoidEffectSelecter:React.FC<AvoidEffectProps> = ({ states, functions, emitArgs }) => {
  const { authUser, emitter, effect, state, cards, values } = states
  const { handleEmit, setValues, putOut } = functions
  if (!state.game) return <></>

  const [localState, setLocalState] = useState(initialState)
  const effectName = extractShouldBeSolvedEffect(effect)
  const cardNumber = resEffectNumber(effectName)
  const myHandsNums = resMyHandsCardNumbers(state.game.board.hands)
  const existCardNumInMyHands = (cardNumber !== null) && myHandsNums.includes(cardNumber)

  const acceptEffect = async() => {
    if (!state.roomId || !authUser.id || !state.game?.board.effect) return
    const re = /draw/u
    const event = effectName[0].match(re) ? 'drawcard__duetoeffect' : 'opencard' 
    const actionEmit:Emit = {
      roomId: state.roomId,
      userId: authUser.id,
      event,
      data: { type: 'action', data: { effectState:state.game.board.effect, effect:effectName[0] }}
    }
    console.log(actionEmit, 'actionEmit')
    await handleEmit(actionEmit)
    setValues({ ...values, showAvoidEffectview:false })
  }

  /**
   * 自分以外のユーザーの手札情報を出力する
   */
  const UserHandsInfo = ({users}:UserHandsInfoProps) => {
    const showUsers = users.filter(_ => _.id !== authUser.id)
    const me = users.filter(_ => _.id === authUser.id)
    return (
      <>
        { showUsers.map(_ => 
        <UserInfo 
          key={_.nickname}
          user={_}
          turnUser={me[0]}
          hands={state.game?.board.otherHands.filter(hand=>hand.userId===_.id)[0]}
        />
        )}
      </>
    )
  }

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.imageBg}>
          <div className={styles.inner}>
          { !localState.cardSelectMode && !localState.handsInspectMode &&
            <>
              <p className={styles.attention}>{`${emitter?.nickname}が\n「${effectName[0]}」を発動しました`}</p>
              <div className={styles.singleCardWrap}>
                <SingleCard card={
                  Object.assign(
                    spreadCardState([state.game.board.trash.card])[0],
                    { style: { width:80, height: 120} }
                  )
                }/>
              </div>
              <div className={styles.actionBtn}>
              <span className={styles.acceptEffect} onClick={acceptEffect}>{`効果を受ける\n(${effectDescription(effectName)})`}</span>
                <span
                  className={existCardNumInMyHands ? styles.escapeEffect : styles.noEscapeEffect}
                  onClick={() => existCardNumInMyHands ? setLocalState({ cardSelectMode: true, handsInspectMode: false }) : undefined}
                  >{cardNumber}を出して回避する</span>
                <span className={styles.inspectOtherHands} onClick={() => setLocalState({ cardSelectMode: false, handsInspectMode: true })}>みんなの手札をみる</span>
                { emitArgs &&
                  <span
                    className={styles.dobonBtn}
                    onClick={() => emit(addEmitArgEvent(emitArgs, 'dobon'))}
                  >どぼんする！</span>
                }
                </div>
            </>
          }
          { localState.cardSelectMode &&
            <div>
              <p className={styles.attention}>カードを選択してください</p>
              {/* {states.cards:効果回避ができる同数字のカードのみをputableにしてHandsに渡す} */}
              { cards.map(_ =>
                <Hands
                  key={`${_.num}${_.suit}`}
                  states={{
                    card: updatePutableState(_, state.game?.board.trash),
                    values
                  }}
                  functions={{
                    putOut,
                    setValues
                  }}
                />
              )}
              <span
                className={styles.noEscapeEffect}
                onClick={() => setLocalState(initialState)}
              >戻る</span>
            </div>
          }

          { localState.handsInspectMode &&
          <div>
            <UserHandsInfo
              users={state.game.board.users}
              authUser={authUser}
            />
            <span
              className={styles.noEscapeEffect}
              onClick={() => setLocalState(initialState)}
            >戻る</span>
            </div>
          }
          </div>
        </div>
      </div>
    </>
  )
}

const updatePutableState = (card: HaveAllPropertyCard, trash:Board['trash'] | undefined ) => {
  if (!trash) return card

  const trashCardNum = Number(spreadCardState([trash.card])[0].num)
  if (card.isPutable && card.num !== trashCardNum) {
    card.isPutable = false
  }
  return card
}

const effectDescription = (effect: Effect[]) => {
  switch(effect[0]) {
    case 'draw2'    : return 'カードを2枚引きます'
    case 'draw4'    : return 'カードを4枚引きます'
    case 'draw6'    : return 'カードを6枚引きます'
    case 'draw8'    : return 'カードを8枚引きます'
    case 'opencard' : return '手札を公開します'
    default         : return ''
  }
}

export default avoidEffectSelecter