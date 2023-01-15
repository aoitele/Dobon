import React, { FC, useContext } from "react"
import { GameStateContext } from "../../../../context/GameProvider"
import styles from './Board.module.scss'
import { ActionsContainer } from "./container/ActionsContainer"
import { BoardInfoContainer } from "./container/BoardInfoContainer"
import { HandsContainer } from "./container/HandsContainer"
import { RoomInfoContainer } from "./container/RoomInfoContainer"
import { UserInfoContainer } from "./container/UserInfoContainer"

const Board:FC = () => {
  const { game } = useContext(GameStateContext)

  return (
    <div className={styles.wrap}>
      <RoomInfoContainer game={game}/>
      <UserInfoContainer board={game.board}/>
      <BoardInfoContainer board={game.board}/>
      <HandsContainer board={game.board}/>
      <ActionsContainer />
    </div>
  )
}

export { Board }