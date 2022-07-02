import React, { useContext } from 'react'
import Image from 'next/image'
import style from './index.module.scss'
import Link from 'next/link'
import { AuthStateContext } from '../../../context/authProvider'
import { isAuthUserFetching, isLoggedIn } from '../../../utils/auth/authState'

const TopPageContent = () => {
  const { authUser } = useContext(AuthStateContext)
  return (
    <>
    <div className={style.wrap}>
      {!isAuthUserFetching(authUser) &&
        <div className={style.content}>
          <h1 className={style.heading1}>Dobon</h1>
          <p className={style.subTitle}>-ultimate trump game-</p>
          <div className={style.logo}>
            <Image
              src='/images/numa_hamaru_woman.png'
              width={140}
              height={140}
            />
          </div>
          {isLoggedIn(authUser) && <p>Welcome! {authUser.nickname}さん</p>}
          <div className={style.linkWrap}>
            <div className={style.link__active}>
              <span className={style.icon}>👨‍👩‍👦‍👦</span>
              <Link href="/room">{isLoggedIn(authUser) ? ' ゲームに参加' :' ゲームにゲスト参加'}</Link>
            </div>
            <div className={authUser ? style.link__active : style.link__disabled}>
              <span className={style.icon}>🃏</span>
              <Link href="/room/create"> ゲームを作成</Link>
            </div>
            {!authUser &&
              <div className={style.loginBtn}>
                <div className={style.link__active}>
                  <span className={style.icon}>👤</span>
                  <Link href="/user/create"> ユーザー登録/ログイン</Link>
                </div>
                <span className={style.hint}>ログインするとゲームを作成できるようになります</span>
              </div>
            }
          </div>
        </div>
      }
      <div className={`${style.bgAnimatedCard} ${style.card1}`}>
        <img src='/images/cards/z.png' width={50} height={75} />
        <img src='/images/cards/c1.png' width={50} height={75} />
      </div>
      <div className={`${style.bgAnimatedCard} ${style.card2}`}>
        <img src='/images/cards/z.png' width={50} height={75} />
        <img src='/images/cards/h1.png' width={50} height={75} />
      </div>
      <div className={`${style.bgAnimatedCard} ${style.card3}`}>
        <img src='/images/cards/z.png' width={50} height={75} />
        <img src='/images/cards/d1.png' width={50} height={75} />
      </div>
      <div className={`${style.bgAnimatedCard} ${style.card4}`}>
        <img src='/images/cards/z.png' width={50} height={75} />
        <img src='/images/cards/s1.png' width={50} height={75} />
      </div>
    </div>
    </>
  )
}

export default TopPageContent