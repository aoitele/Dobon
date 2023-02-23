import React, { FC } from 'react'
import Image from 'next/image'
import style from './EffectAnimation.module.scss'
import { ModalEffect, Player } from '../../@types/game'

const effectAnimation:React.FC<ModalEffect> = ({ user, action, message }) => {
  return (
    <>
      <div className={style.wrap}>
        <div className={style.imageWrap}>
          <Image
            src={`/images/game/effect/${action}.png`}
            width={300}
            height={300}
            objectFit="contain"
          />
        </div>
        <div className={style.imageBg}/>
      </div>
      <div className={style.userInfo}>
        { Array.isArray(user)
          ? user.map(u => <UserInfo key={u.turn} user={u} message={message} />)
          : <UserInfo user={user} message={message} />
        }
      </div>
    </>
  )
}

interface UserInfoProps {
  user: Pick<Player, "nickname" | "turn">
  message: ModalEffect['message']
}

const UserInfo:FC<UserInfoProps> = ({ user, message }) => {
  return (
    <>
      <Image
        src={`/images/game/userIcon/${user.turn}.png`}
        width={60}
        height={60}
        objectFit="contain"
      />
      <div>
        <p className={style.nickName}>{user.nickname}</p>
        <p style={{whiteSpace: 'pre-line'}}>{message}</p>
      </div>
    </>
  )
}

export default effectAnimation