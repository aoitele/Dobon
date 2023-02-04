import React, { FC, useContext } from "react"
import styles from './HandsContainer.module.scss'
import Hands from "../modules/Hands"
import { BoardStateContext, BoardDispathContext, boardProviderInitialState } from "../../../../../context/BoardProvider"

const HandsContainer:FC = () => {
  const [boardState, boardDispatch] = [useContext(BoardStateContext), useContext(BoardDispathContext)]

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.slides}>
          <Hands />
        </div>
      </div>
      <div
        className={boardState.selectedCard && styles.stateResetArea}
        onClick={() => boardDispatch?.(
          prevState => ({
            ...prevState,
            selectedCard: '',
            selectedWildCard: boardProviderInitialState.selectedWildCard,
          })
        )}
      />
    </>
  )
}

export { HandsContainer }