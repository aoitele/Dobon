import React, { FC, useContext, useState } from "react"
import { BoardStateContext, BoardDispathContext } from "../../../../../context/BoardProvider"
import { GameStateContext, GameDispathContext, GameProviderState } from "../../../../../context/GameProvider"
import { resMyHandsCardNumbers } from "../../../../../utils/game/checkHand"

import { extractShouldBeSolvedEffect, resEffectNumber } from "../../../../../utils/game/effect"
import spreadCardState from "../../../../../utils/game/spreadCardState"
import { culcBeforeUserTurn } from "../../../../../utils/game/turnInfo"
import { SingleCard } from "../../../../game/SingleCard"
import UserInfo from "../../../../game/UserInfo"
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
  const havingOneCardInMyHands = existCardNumInMyHands && myHandsNums.length === 1
  const allowEscape = existCardNumInMyHands && !havingOneCardInMyHands

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
                  className={allowEscape ? styles.escapeEffect : styles.noEscapeEffect}
                  onClick={() => allowEscape ? setLocalState({ cardSelectMode: true, handsInspectMode: false }) : undefined}
                  >{cardNumber}を出して回避する</span>
                  {!existCardNumInMyHands && <span className={styles.cantAvoidEffectDesc}>※{cardNumber}を持っていないため回避できません</span>}
                  {havingOneCardInMyHands && <span className={styles.cantAvoidEffectDesc}>※{cardNumber}を持っていますが手札が1枚のため出せません</span>}
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
              <Hands isAvoidSelectMode/>
              <span
                className={styles.backBtn}
                onClick={() => setLocalState(initialState)}
              >戻る</span>
            </div>
          }

          { localState.handsInspectMode &&
          <div>
            <UserHandsInfo board={gameState.game.board} />
            <span
              className={styles.backBtn}
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

/**
 * 自分以外のユーザーの手札情報を出力する
 */
interface UserHandsInfoPros {
  board: GameProviderState['game']['board']
}

const UserHandsInfo:FC<UserHandsInfoPros> = ({ board }) => {
  const cpus = board.users.filter(user => user.mode)

  return (
    <>
      { cpus.map(cpu =>
      <UserInfo
        key={cpu.nickname}
        user={cpu}
        turnUser={null}
        hands={board.otherHands.filter(hand => hand.nickname === cpu.nickname)[0]}
      />
      )}
    </>
  )
}

export default AvoidEffectSelecter