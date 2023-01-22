import React, { FC, useContext } from "react"
import styles from './HandsContainer.module.scss'
import spreadCardState from "../../../../../utils/game/spreadCardState"
import Hands from "../../../../game/Hands"
import { BoardDispathContext, BoardStateContext } from "../../../../../context/BoardProvider"
import { putOut } from "../../utils/putOut"
import { GameDispathContext, GameStateContext } from "../../../../../context/GameProvider"

const HandsContainer:FC = () => {
  const [gameState, boardState, gameDispatch, boardDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(GameDispathContext), useContext(BoardDispathContext)]
  if (!boardDispatch || !gameDispatch) return <></>
  const { board } = gameState.game

  return (
    <div className={styles.wrap}>
      <div className={styles.slides}>
        { spreadCardState(board.hands, true).map(card =>
          <Hands
            key={`${card.num}${card.suit}`}
            states={{
              card,
              values: boardState
            }}
            functions={{putOut, setValues: boardDispatch}}
          />
        )}
      </div>
    </div>
  )
}

export { HandsContainer }