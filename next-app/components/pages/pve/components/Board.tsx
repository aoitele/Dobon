import React, { FC, useContext } from "react"
import { GameStateContext } from "../../../../context/gameProvider"
import { GameSet } from "../../../game/GameSet"
import styles from './Board.module.scss'
import { BoardInfoContainer } from "./modules/BoardInfoContainer"
import { HandsContainer } from "./modules/HandsContainer"
import { UserInfoContainer } from "./modules/UserInfoContainer"

const Board:FC = () => {
  const { game } = useContext(GameStateContext)

  return (
    <div className={styles.wrap}>
      <div className={styles.roomInfo}>
        <GameSet gameSet={1} setCount={10} />
      </div>
      <UserInfoContainer board={game.board}/>
      <BoardInfoContainer board={game.board}/>
      <HandsContainer board={game.board}/>
    </div>
  )
}

export { Board }