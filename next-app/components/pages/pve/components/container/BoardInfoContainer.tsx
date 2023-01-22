import React, { FC, useContext } from "react"
import spreadCardState from "../../../../../utils/game/spreadCardState"
import { SingleCard } from "../../../../game/SingleCard"
import styles from './BoardInfoContainer.module.scss'
import Image from 'next/image'
import { GameStateContext } from "../../../../../context/GameProvider"

const BoardInfoContainer:FC = () => {
  const { board } = useContext(GameStateContext).game
  const turnUser = board.users.filter(user => user.turn === board.turn)[0]

  return (
    <div className={styles.wrap}>
      { board.trash.card &&
        <SingleCard
          key='trash'
          card = {
            Object.assign(
              spreadCardState([board.trash.card])[0],
              { style: { width:80, height: 120} }
            )
          }
        />
      }
      <div>
        { turnUser &&
          <p className={styles.turnTxt}>
            <span>{turnUser?.nickname}</span> のターン
          </p>
        }
        <div className={styles.effectWrap}>
          { board.effect && 
          <>
            { board.effect.includes('reverse') && <span className={styles.reverse}>🔄</span> }
            { board.effect.includes('wildspade') && <span className={styles.wildSuit}>♠️</span> }
            { board.effect.includes('wildclub') && <span className={styles.wildSuit}>♣️</span> }
            { board.effect.includes('wilddia') && <span className={styles.wildSuit}>♦️</span> }
            { board.effect.includes('wildheart') && <span className={styles.wildSuit}>♥️</span> }
            { board.effect.includes('joker') && <span className={styles.joker}>🃏</span> }
            { board.effect.includes('draw2') &&
              <div className={styles.drawCardInfo}>
                <div>
                  <span className={styles.icon}>🃏</span>
                  <span className={styles.count}>×2</span>
                </div>
              </div>
            }
            { board.effect.includes('opencard') && <span className={styles.openCardIcon}>👑</span> }
          </>
          }
        </div>
      </div>
      <div>
        <Image src='/images/cards/deck.png' width={70} height={105} />
        <p className={styles.deckCount}>x {board.deckCount}</p>
      </div>
    </div>
  )
}

export { BoardInfoContainer }