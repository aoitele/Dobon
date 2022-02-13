/**
 * 解決すべきカード効果が場に発生した時のポップアップ
 */
import React, { useState } from 'react'
import ModalBack from '../feedback/ModalBack'
import { InitialBoardState, Player, SolvableEffects, Board } from '../../@types/game'
import { extractShouldBeSolvedEffect, resEffectNumber } from '../../utils/game/effect'
import { resMyHandsCardNumbers } from '../../utils/game/checkHand'
import styles from './AvoidEffectSelecter.module.scss'
import { SingleCard } from './SingleCard'
import spreadCardState from '../../utils/game/spreadCardState'
import { Emit, HandleEmitFn } from '../../@types/socket'
import { gameInitialState } from '../../utils/game/roomStateReducer'
import Hands from './Hands'
import { HaveAllPropertyCard } from '../../@types/card'

interface Props {
  states:{
    state: gameInitialState
    authUser: AuthAPIResponse.UserMe
    emitter: Player
    effect: SolvableEffects
    cards: HaveAllPropertyCard[]
    values: InitialBoardState
  }
  functions: {
    handleEmit: HandleEmitFn
    setValues: React.Dispatch<React.SetStateAction<InitialBoardState>>
    putOut: (card: string) => Promise<void> // eslint-disable-line no-unused-vars
  }
}

const avoidEffectSelecter:React.FC<Props> = ({ states, functions }) => {
  const { authUser, emitter, effect, state, cards, values } = states
  const { handleEmit, setValues, putOut } =functions
  if (!state.game) return <></>

  const [selectMode, setSelectMode] = useState(false)
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
  }
  return (
    <>
      <ModalBack />
        <div className={styles.wrap}>
          <div className={styles.imageBg}>
            <div className={styles.inner}>
            { selectMode
            ? <>
              <div>
                <p className={styles.attention}>カードを選択してください</p>
                {/* {states.cards:効果回避ができる同数字のカードのみをputableにしてHandsに渡す} */}
                <Hands
                  states={{
                    cards:updatePutableState(cards, state.game.board.trash),
                    values,
                    selectedCard: values.selectedCard
                  }}
                  functions={{
                    putOut,
                    setValues
                  }}
                  />
                <span
                  className={styles.noEscapeEffect}
                  onClick={() => setSelectMode(false)}
                >戻る</span>
              </div>
            </>
            : <>
                <p className={styles.attention}>{`${emitter?.nickname}が\n「${effectName}」を発動しました`}</p>
                <div className={styles.singleCardWrap}>
                  <SingleCard card={
                    Object.assign(
                      spreadCardState(state.game.board.trash)[0],
                      { style: { width:80, height: 120} }
                    )
                  }/>
                </div>
                <div className={styles.actionBtn}>
                  <span className={styles.acceptEffect} onClick={acceptEffect}>効果を受ける</span>
                  <span
                    className={existCardNumInMyHands ? styles.escapeEffect : styles.noEscapeEffect}
                    onClick={() => existCardNumInMyHands ? setSelectMode(true) : undefined}
                    >{cardNumber}を出して回避する</span>
                  <span className={styles.acceptEffect} onClick={acceptEffect}>みんなの手札をみる</span>
                </div>
              </>
            }
            </div>
          </div>
      </div>
    </>
  )
}

const updatePutableState = (cards: HaveAllPropertyCard[], trash:Board['trash'] ) => {
  const trashCardNum = Number(spreadCardState(trash)[0].num)
  const res:HaveAllPropertyCard[] = cards.map(card => {
    if (card.isPutable && card.num !== trashCardNum) {
      card.isPutable = false
    }
    return card
  })
  return res
}

export default avoidEffectSelecter