import React, { FC } from "react"
import styles from './Board.module.scss'
import { ActionsContainer } from "./container/ActionsContainer"
import { BoardInfoContainer } from "./container/BoardInfoContainer"
import { EffectContainer } from "./container/EffectContainer"
import { HandsContainer } from "./container/HandsContainer"
import { MyInfoContainer } from "./container/MyInfoContainer"
import { RoomInfoContainer } from "./container/RoomInfoContainer"
import { UserInfoContainer } from "./container/UserInfoContainer"

const Board:FC = () => {
  return (
    <div className={styles.wrap}>
      <RoomInfoContainer />
      <UserInfoContainer />
      <BoardInfoContainer />
      <MyInfoContainer />
      <HandsContainer />
      <ActionsContainer />
      <EffectContainer />
    </div>
  )
}

export { Board }