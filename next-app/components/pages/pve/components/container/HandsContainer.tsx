import React, { FC, useContext } from "react"
import { Board } from "../../../../../@types/game"
import styles from './HandsContainer.module.scss'
import spreadCardState from "../../../../../utils/game/spreadCardState"
import Hands from "../../../../game/Hands"
import { BoardDispathContext, BoardStateContext } from "../../../../../context/BoardProvider"
import { putOut } from "../../utils/putOut"

interface Props {
  board: Board
}

const HandsContainer:FC<Props> = ({ board }) => {
  const state = useContext(BoardStateContext)
  const dispatch = useContext(BoardDispathContext)
  if (!dispatch) return <></>

  return (
    <div className={styles.wrap}>
      <div className={styles.slides}>
        { spreadCardState(board.hands, true).map(card =>
          <Hands
            key={`${card.num}${card.suit}`}
            states={{
              card,
              values: state
            }}
            functions={{putOut, setValues: dispatch}}
          />
        )}
      </div>
    </div>
  )
}

export { HandsContainer }