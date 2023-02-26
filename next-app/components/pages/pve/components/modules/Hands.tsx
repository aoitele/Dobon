import React, { FC, useContext } from 'react'
import { BoardDispathContext, BoardStateContext } from '../../../../../context/BoardProvider'
import { GameDispathContext, GameStateContext } from '../../../../../context/GameProvider'
import spreadCardState from '../../../../../utils/game/spreadCardState'
import { SingleCard } from '../../../../game/SingleCard'
import { Hand } from '../../utils/Hand'
import Image from 'next/image'
import styles from './Hands.module.scss'

interface Props {
  isAvoidSelectMode?: boolean
}

const Hands: FC<Props> = ({ isAvoidSelectMode }) => {
  const [gameState, boardState, gameDispatch, boardDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(GameDispathContext), useContext(BoardDispathContext)]

  if (!gameDispatch || !boardDispatch) return <></>
  
  const MyHand = new Hand(gameState.wsClient, gameState, boardState, gameDispatch, boardDispatch)
  let hands = spreadCardState(gameState.game.board.hands, true)

  // カード効果回避モード時：数字が合致するカードのみputableにする
  if (isAvoidSelectMode) {
    const lastTrashNum: number = spreadCardState([gameState.game.board.trash.card], true)[0].num
    hands = hands.map(card => {
      if (card.num !== lastTrashNum) {
        card.isPutable = false
      }
      return card
    })
  }
 
  return (
    <div className={styles.slides}>
      {hands.map((card, idx) => {
        const face = `${card.suit}${card.num}`
        return (
          <div key={face}>
            <div
              className={`
              ${styles.card}
              ${card.isPutable ? undefined : styles.cantPut}
              ${boardState.selectedCard === face ? styles.selected : undefined }
              `} 
              onClick={() => boardState.selectedCard === face ? MyHand.putOut(gameState.game.board.hands[idx]) : undefined }
            >
              <div className={styles.effectEye}>
                { card.isOpen && <Image src='/images/game/effect/eye.png' width={15} height={15} />}
              </div>
              <SingleCard
                card={{
                  suit: card.suit,
                  num: card.num,
                  isOpen: true,
                  isPutable: card.isPutable,
                  style: {
                    width:160,
                    height:240
                  }
                }}
                values={boardState}
                setValues={boardDispatch}
              />
              { boardState.selectedCard === `${card.suit}${card.num}` && <span>⚫︎</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}


export default Hands