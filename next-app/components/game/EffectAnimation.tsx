import React, { FC } from 'react'
import Image from 'next/image'
import style from './EffectAnimation.module.scss'
import { ModalEffect, Player } from '../../@types/game'
import { DobonEffect } from './effect/DobonEffect'
import { Draw2Effect } from './effect/Draw2Effect'
import { Draw4Effect } from './effect/Draw4Effect'
import { Draw6Effect } from './effect/Draw6Effect'
import { Draw8Effect } from './effect/Draw8Effect'
import { JokerEffect } from './effect/JokerEffect'
import { OpenCardEffect } from './effect/OpenCardEffect'
import { SkipEffect } from './effect/SkipEffect'
import { WildEffect } from './effect/WildEffect'
import { ReverseEffect } from './effect/ReverseEffect'

const effectAnimation:React.FC<ModalEffect> = ({ user, action, message }) => {
  const isJokerEffect = action === 'joker'
  return (
    <>
      <div className={style.wrap}>
        <div className={style.imageWrap}>
          <div className={isJokerEffect ? style.JokerEffectWrap : style.EffectWrap}>
          {action === 'dobon'     && <DobonEffect/>}
          {action === 'draw2'     && <Draw2Effect/>}
          {action === 'draw4'     && <Draw4Effect/>}
          {action === 'draw6'     && <Draw6Effect/>}
          {action === 'draw8'     && <Draw8Effect/>}
          {action === 'joker'     && <JokerEffect/>}
          {action === 'opencard'  && <OpenCardEffect/>}
          {action === 'skip'      && <SkipEffect/>}
          {action === 'reverse'   && <ReverseEffect/>}
          {action === 'wild'      && <WildEffect/>}
          {action === 'wildclub'  && <WildEffect/>}
          {action === 'wilddia'   && <WildEffect/>}
          {action === 'wildheart' && <WildEffect/>}
          {action === 'wildspade' && <WildEffect/>}
          </div>
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