import React, { FC, useContext } from "react"
import { BoardDispathContext, BoardStateContext } from "../../../../../context/BoardProvider"
import ActionBtn from "../modules/ActionBtn"
import SelectSuit from "../../../../game/SelectSuit"
import styles from './ActionsContainer.module.scss'

const ActionsContainer:FC = () => {
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
          <ActionBtn type='action' />
          <ActionBtn type='dobon' />
        </div>
      }
    </div>
  )
}

export { ActionsContainer }