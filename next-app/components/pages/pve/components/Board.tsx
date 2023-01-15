import React, { FC, useContext } from "react"
import { GameStateContext } from "../../../../context/gameProvider"
import styles from './Board.module.scss'
import { BoardInfoContainer } from "./modules/BoardInfoContainer"
import { HandsContainer } from "./modules/HandsContainer"
import { RoomInfoContainer } from "./modules/RoomInfoContainer"
import { UserInfoContainer } from "./modules/UserInfoContainer"

const Board:FC = () => {
  const { game } = useContext(GameStateContext)

  return (
    <div className={styles.wrap}>
      <RoomInfoContainer game={game}/>
      <UserInfoContainer board={game.board}/>
      <BoardInfoContainer board={game.board}/>
      <HandsContainer board={game.board}/>
    </div>
  )
}

export { Board }