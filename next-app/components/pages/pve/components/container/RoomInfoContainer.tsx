import React, { FC, useContext } from "react"
import { GameSet } from "../../../../game/GameSet"
import styles from './RoomInfoContainer.module.scss'
import { GameStateContext } from "../../../../../context/GameProvider"

const RoomInfoContainer:FC = () => {
  const { game } = useContext(GameStateContext)

  return (
    <div className={styles.wrap}>
      <GameSet gameSet={game?.id ?? 1} setCount={game?.setCount ?? 0} />
    </div>
  )
}

export { RoomInfoContainer }