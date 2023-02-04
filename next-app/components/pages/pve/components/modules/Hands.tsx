import React, { useContext } from 'react'
import { BoardDispathContext, BoardStateContext } from '../../../../../context/BoardProvider'
import { GameDispathContext, GameStateContext } from '../../../../../context/GameProvider'
import spreadCardState from '../../../../../utils/game/spreadCardState'
import { SingleCard } from '../../../../game/SingleCard'
import { Hand } from '../../utils/Hand'
import Image from 'next/image'
import styles from './Hands.module.scss'

const Hands = () => {
  const [gameState, boardState, gameDispatch, boardDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(GameDispathContext), useContext(BoardDispathContext)]

  if (!gameDispatch || !boardDispatch) return <></>
  
  const MyHand = new Hand(gameState.wsClient, gameState, gameDispatch, boardDispatch)
  const hands = spreadCardState(gameState.game.board.hands, true)
 
  return (
    <div className={styles.slides}>
      {hands.map(card => {
        const face = `${card.suit}${card.num}`
        return (
          <div key={face}>
            <div
              className={`
              ${styles.card}
              ${card.isPutable ? undefined : styles.cantPut}
              ${boardState.selectedCard === face ? styles.selected : undefined }
              `} 
              onClick={() => boardState.selectedCard === face ? MyHand.putOut(face) : undefined }
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