import React from 'react'
import Image from 'next/image'
import style from './index.module.scss'
import Link from 'next/link'

const TopPageContent = () => {
  return (
    <>
    <div className={style.wrap}>
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
        <div className={style.linkWrap}>
          <div className={style.link}>
            <span className={style.icon}>👨‍👩‍👦‍👦</span>
            <Link href="/room"> ゲームに参加</Link>
          </div>
          <div className={style.link}>
            <span className={style.icon}>🃏</span>
            <Link href="/room/create"> ゲームを作成</Link>
          </div>
          <div className={style.link}>
            <span className={style.icon}>👤</span>
            <Link href="/user/create"> ユーザー登録</Link>
          </div>
        </div>
      </div>
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