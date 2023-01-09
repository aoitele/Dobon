import React, { FC, useContext } from "react"
import { GameStateContext } from "../../../../context/gameProvider"
import { GameSet } from "../../../game/GameSet"
import UserInfo from "../../../game/UserInfo"
import styles from './Board.module.scss'

const Board:FC = () => {
  const { game } = useContext(GameStateContext)
  const boardState = game.board
  const turnUser = boardState.users.filter(user => user.turn === boardState.turn)[0]

  return (
    <div className={styles.wrap}>
      <div className={styles.roomInfo}>
        <GameSet gameSet={1} setCount={10} />
      </div>
      <div className={styles.userInfoWrap}>
        { game.board.users.map(
            user => user.mode &&
            <>
              <UserInfo
                key={`user_${user.id}_info`}
                user={user}
                hands={boardState.otherHands.filter(_=>_.userId === user.id)[0]} turnUser={turnUser}
              />
              {/* TODO 強さラベルの表示 */}
              {/* <span>{user.mode}</span> */}
            </>
          )
        }
      </div>
    </div>
  )
}

export { Board }