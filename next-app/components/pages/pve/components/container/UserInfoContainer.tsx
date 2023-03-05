import React, { FC, useContext } from "react"
import { GameStateContext } from "../../../../../context/GameProvider"
import UserInfo from "../../../../game/UserInfo"
import styles from './UserInfoContainer.module.scss'

const UserInfoContainer:FC = () => {
  const gameState = useContext(GameStateContext)
  const { board, event } = gameState.game

  const turnUser = board.users.filter(user => user.turn === board.turn)[0]

  return (
    <div className={styles.wrap}>
      { board.users.map(
        (user, idx) => user.mode &&
        <div key={idx}>
          <UserInfo
            key={`user_${user.id}_info`}
            user={user}
            hands={board.otherHands.filter(hand => hand.nickname === user.nickname)[0]}
            turnUser={turnUser}
          />
          {/* TODO 強さラベルの表示 */}
          {/* <span>{user.mode}</span> */}
          {/* 効果を受けた時にメッセージを表示させている */}
          <div className={styles.eventWrap}>
            {event.message && event.user[0].nickname === user.nickname && <span className={styles.eventMessage}>{event.message}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export { UserInfoContainer }