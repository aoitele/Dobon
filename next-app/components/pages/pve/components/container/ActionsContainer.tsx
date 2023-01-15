import React, { FC, useContext } from "react"
import { BoardDispathContext, BoardStateContext } from "../../../../../context/BoardProvider"
import { GameStateContext } from "../../../../../context/GameProvider"
import ActionBtn from "../modules/ActionBtn"
import SelectSuit from "../../../../game/SelectSuit"
import styles from './ActionsContainer.module.scss'

const ActionsContainer:FC = () => {
  const gameState = useContext(GameStateContext)
  const boardState = useContext(BoardStateContext)
  const boardDispatch = useContext(BoardDispathContext)

  if(!boardDispatch) return <></>
  
  return (
    <div className={styles.wrap}>
      { boardState.selectedWildCard.isSelected
      ? <SelectSuit
          values={boardState}
          setValues={boardDispatch}
          />
      : <div className={styles.actionBtnWrap}>
          <ActionBtn/>
          <ActionBtn/>
        </div>
      }
    </div>
  )
}

export { ActionsContainer }