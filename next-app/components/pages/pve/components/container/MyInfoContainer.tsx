import React, { useContext } from 'react'
import { GameStateContext } from '../../../../../context/GameProvider'
import UserInfo from '../../../../game/UserInfo'
import styles from './MyInfoContainer.module.scss'

const MyInfoContainer = () => {
  const { board } = useContext(GameStateContext).game
  const turnUser = board.users.find(user => user.turn === board.turn)

  return (
    <div className={styles.wrap}>
      {turnUser && <UserInfo user={board.users[0]} turnUser={turnUser} />}
    </div>
  )
}

export { MyInfoContainer }