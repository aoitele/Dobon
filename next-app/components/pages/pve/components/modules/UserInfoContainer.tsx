import React, { FC } from "react"
import { Board } from "../../../../../@types/game"
import UserInfo from "../../../../game/UserInfo"
import styles from './UserInfoContainer.module.scss'

interface Props {
  board: Board
}

const UserInfoContainer:FC<Props> = ({ board }) => {
  const turnUser = board.users.filter(user => user.turn === board.turn)[0]

  return (
    <div className={styles.wrap}>
      { board.users.map(
        user => user.mode &&
        <>
          <UserInfo
            key={`user_${user.id}_info`}
            user={user}
            hands={board.otherHands.filter(_=>_.userId === user.id)[0]}
            turnUser={turnUser}
          />
          {/* TODO 強さラベルの表示 */}
          {/* <span>{user.mode}</span> */}
        </>
      )}
    </div>
  )
}

export { UserInfoContainer }