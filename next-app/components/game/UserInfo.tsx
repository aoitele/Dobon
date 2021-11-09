import React from 'react'
import Image from 'next/image'
import type { GameUserInfo } from '../../@types/user'
import style from './UserInfo.module.scss'

export const UserInfo: React.FC<GameUserInfo> = ({ nickname, score }) => {

  return (
    <div className={style.wrap}>
    <Image
      src="https://placehold.jp/b8b8b8/ffffff/150x150.jpg?text=userIcon&amp;css=%7B%22border-radius%22%3A%2250%25%22%7D"
      width={40}
      height={40}
      layout="fixed"
    />
    <div>
      <p>{nickname}</p>
      <p>{score}</p>
    </div>
  </div>
  )
}