import React, { FC, useContext } from "react"
import { BoardDispathContext, BoardStateContext } from "../../../../../context/BoardProvider"
import ActionBtn from "../modules/ActionBtn"
import SelectSuit from "../../../../game/SelectSuit"
import styles from './ActionsContainer.module.scss'
import HintText from "../../../../game/HintText"
import { GameStateContext } from "../../../../../context/GameProvider"

const ActionsContainer:FC = () => {
  const [boardState, gameState, boardDispatch] = [useContext(BoardStateContext), useContext(GameStateContext), useContext(BoardDispathContext)]
  if (!boardDispatch) return <></>
  
  return (
    <>
      <div className={styles.wrap}>
        {boardState.isMyTurn && boardState.selectedWildCard.isSelected
        ? <SelectSuit
            values={boardState}
            setValues={boardDispatch}
            />
        : <div className={styles.actionBtnWrap}>
            <ActionBtn type='action' />
            <ActionBtn type='dobon' />
          </div>
        }
      </div>
      <HintText boardState={gameState.game.board}/>
    </>
  )
}

export { ActionsContainer }