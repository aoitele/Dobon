import React, { FC } from "react"
import { GameSet } from "../../../../game/GameSet"
import { Game } from "../../../../../@types/game"
import styles from './RoomInfoContainer.module.scss'

interface Props {
  game: Game
}
const RoomInfoContainer:FC<Props> = ({ game }) => {
  return (
    <div className={styles.wrap}>
      <GameSet gameSet={game?.id ?? 1} setCount={game?.setCount ?? 0} />
    </div>
  )
}

export { RoomInfoContainer }