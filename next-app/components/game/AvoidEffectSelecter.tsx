/**
 * 解決すべきカード効果が場に発生した時のポップアップ
 */
import React from 'react'
import ModalBack from '../feedback/ModalBack'
import { Player, SolvableEffects } from '../../@types/game'
import { extractShouldBeSolvedEffect, resEffectNumber } from '../../utils/game/effect'
import { resMyHandsCardNumbers } from '../../utils/game/checkHand'
import styles from './AvoidEffectSelecter.module.scss'
import { SingleCard } from './SingleCard'
import spreadCardState from '../../utils/game/spreadCardState'
import { Emit, HandleEmitFn } from '../../@types/socket'
import { gameInitialState } from '../../utils/game/roomStateReducer'

interface Props {
  authUser: AuthAPIResponse.UserMe
  emitter: Player
  effect: SolvableEffects
  state: gameInitialState
  handleEmit: HandleEmitFn
}

const avoidEffectSelecter:React.FC<Props> = ({ authUser, emitter, effect, state, handleEmit }) => {
  if (!state.game) return <></>

  const effectName = extractShouldBeSolvedEffect(effect)
  const cardNumber = resEffectNumber(effectName)
  const myHandsNums = resMyHandsCardNumbers(state.game.board.hands)
  const existCardNumInMyHands = (cardNumber !== null) && myHandsNums.includes(cardNumber)

  const acceptEffect = async() => {
    console.log('acceptEffect')
    console.log(state, 'state')
    console.log(authUser, 'authuser')
    if (!state.roomId || !authUser.id || !state.game?.board.effect) return
    console.log('ok')
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
            <>
              <p className={styles.attention}>{`${emitter?.nickname}が\n「${effectName}」を発動しました`}</p>
              <div className={styles.singleCardWrap}>
                <SingleCard card={
                  Object.assign(
                    spreadCardState(state.game.board.trash)[0],
                    { style: { width:80, height: 120} }
                  )
                }/>
              </div>
              <div>
                <span className={styles.acceptEffect} onClick={acceptEffect}>効果を受ける</span>
                <span className={existCardNumInMyHands ? styles.escapeEffect : styles.noEscapeEffect}>{cardNumber}を出して回避する</span>
              </div>
            </>
          </div>
        </div>
    </div>
    </>
  )
}

export default avoidEffectSelecter