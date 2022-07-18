import React from 'react'
import styles from './RoomList.module.scss'
import { Room } from '../../@types/game'
import { User } from '../../@types/user'

interface Props {
  room: Pick<Room, 'id' | 'title' | 'max_seat' | 'set_count' | 'rate' | 'create_user_id' | 'status'> & { user: Pick<User, 'nickname'> }
  authUser: AuthAPIResponse.UserMe | null | undefined
}

const RoomList:React.FC<Props> = ({ room, authUser }) => {
  return(
    <li className={styles.wrap}>
      <a href={`/room/${room.id}`}>
        <p className={styles.title}>{room.title}</p>
        <div className={styles.info}>
          <p>👤 {room.user.nickname}</p>
          <p>👨‍👩‍👧‍👦 ~{room.max_seat}名</p>
          <p>🃏 {room.set_count}ゲーム</p>
          <p>🎖 ×{room.rate}</p>
        </div>
        { authUser && 
          room.create_user_id === authUser.id && <p className={styles.txtOwner}>ゲームを開始</p> ||
          room.status === 0 && <p className={styles.txtParticipants}>参加可能</p>
        }
      </a>
    </li>
  )
}

export default RoomList