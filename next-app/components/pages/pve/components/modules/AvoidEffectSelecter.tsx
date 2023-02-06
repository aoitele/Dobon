import React, { useContext, useState } from "react"
import { BoardStateContext, BoardDispathContext } from "../../../../../context/BoardProvider"
import { GameStateContext, GameDispathContext } from "../../../../../context/GameProvider"
import { resMyHandsCardNumbers } from "../../../../../utils/game/checkHand"

import { extractShouldBeSolvedEffect, resEffectNumber } from "../../../../../utils/game/effect"
import spreadCardState from "../../../../../utils/game/spreadCardState"
import { culcBeforeUserTurn } from "../../../../../utils/game/turnInfo"
import { SingleCard } from "../../../../game/SingleCard"
import { Effect } from "../../utils/Effect"
import styles from './AvoidEffectSelecter.module.scss'
import Hands from "./Hands"

const initialState = {
  cardSelectMode: false,
  handsInspectMode: false
}

/**
 * 解決すべきカード効果が場に発生した時のポップアップ
 */
const AvoidEffectSelecter = () => {
  const [gameState, boardState, gameDispatch, boardDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(GameDispathContext), useContext(BoardDispathContext)]
  const [localState, setLocalState] = useState(initialState)

  if (!gameDispatch || !boardDispatch) return <></>

  const { turn, users, effect } = gameState.game.board
  const beforeUserTurn = turn && culcBeforeUserTurn(turn, users, effect.includes('reverse'))
  const beforeUser = users.find(user => user.turn === beforeUserTurn)

  const effectName = extractShouldBeSolvedEffect(gameState.game.board.effect)
  const cardNumber = effectName && resEffectNumber(effectName)
  const myHandsNums = resMyHandsCardNumbers(gameState.game.board.hands)
  const existCardNumInMyHands = (cardNumber !== null) && myHandsNums.includes(cardNumber)

  const GameEffect = new Effect(gameState.wsClient, gameState, boardState, gameDispatch, boardDispatch)

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.imageBg}>
          <div className={styles.inner}>
          { !localState.cardSelectMode && !localState.handsInspectMode &&
            <>
              <p className={styles.attention}>{`${beforeUser?.nickname}が\n「${effectName}」を発動しました`}</p>
              <div className={styles.singleCardWrap}>
                <SingleCard card={
                  Object.assign(
                    spreadCardState([gameState.game.board.trash.card])[0],
                    { style: { width:80, height: 120} }
                  )
                }/>
              </div>
              <div className={styles.actionBtn}>
              <span className={styles.acceptEffect} onClick={() => GameEffect.accept()}>{`効果を受ける\n(${GameEffect.description})`}</span>
                <span
                  className={existCardNumInMyHands ? styles.escapeEffect : styles.noEscapeEffect}
                  onClick={() => existCardNumInMyHands ? setLocalState({ cardSelectMode: true, handsInspectMode: false }) : undefined}
                  >{cardNumber}を出して回避する</span>
                <span className={styles.inspectOtherHands} onClick={() => setLocalState({ cardSelectMode: false, handsInspectMode: true })}>みんなの手札をみる</span>
                {/* { emitArgs &&
                  <span
                    className={styles.dobonBtn}
                    onClick={() => emit(addEmitArgEvent(emitArgs, 'dobon'))}
                  >どぼんする！</span>
                } */}
                </div>
            </>
          }
          { localState.cardSelectMode &&
            <div>
              <p className={styles.attention}>カードを選択してください</p>
              {/* {states.cards:効果回避ができる同数字のカードのみをputableにしてHandsに渡す} */}
              <Hands />
              <span
                className={styles.noEscapeEffect}
                onClick={() => setLocalState(initialState)}
              >戻る</span>
            </div>
          }

          { localState.handsInspectMode &&
          <div>
            {/* <UserHandsInfo
              users={state.game.board.users}
              authUser={authUser}
            /> */}
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

export default AvoidEffectSelecter