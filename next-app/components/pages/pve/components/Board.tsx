import React, { FC } from "react"
import styles from './Board.module.scss'
import { ActionsContainer } from "./container/ActionsContainer"
import { BoardInfoContainer } from "./container/BoardInfoContainer"
import { HandsContainer } from "./container/HandsContainer"
import { RoomInfoContainer } from "./container/RoomInfoContainer"
import { UserInfoContainer } from "./container/UserInfoContainer"

const Board:FC = () => {

  return (
    <div className={styles.wrap}>
      <RoomInfoContainer />
      <UserInfoContainer />
      <BoardInfoContainer />
      <HandsContainer />
      <ActionsContainer />
    </div>
  )
}

export { Board }