import React, { FC, useContext, useState } from 'react'
import Image from 'next/image'
import style from './index.module.scss'
import Link from 'next/link'
import { AuthStateContext } from '../../../context/AuthProvider'
import { isAuthUserFetching, isLoggedIn, isNotLoggedIn } from '../../../utils/auth/authState'
import logout from '../../../utils/auth/logout'
import PVESelecterModal from './modules/PVESelecterModal'

export interface TopPageState {
  selectedPvP: boolean,
  selectedPvE: boolean,
}

export const initialState: TopPageState = {
  selectedPvP: false, // 対人戦を選択したか
  selectedPvE: false, // 対COM戦を選択したか
}

const TopPageContent:FC = () => {
  const [values, setValues] = useState(initialState)
  const { authUser } = useContext(AuthStateContext)

  return (
    <>
    <div className={style.wrap}>
      {values.selectedPvE && <PVESelecterModal initialState={initialState} setValues={setValues} isCalledByResultBoard={false} />}
      {!isAuthUserFetching(authUser) &&
        <div className={style.content}>
          <h1 className={style.heading1}>Dobon</h1>
          <p className={style.subTitle}>playing card game</p>
          <div className={style.logo}>
            <Image
              src='/images/numa_hamaru_woman.png'
              width={140}
              height={140}
            />
          </div>
          {isLoggedIn(authUser) && <p>Welcome! <span className={style.nickanme}>{authUser.nickname}</span></p>}
          <div>
            {values.selectedPvP
            ? <>
                <div className={style.link__active_emphasis}>
                  <span className={style.icon}>🃏 </span>
                  <Link href="/room">ルームに参加する</Link>
                </div>
                <div className={authUser ? style.link__active_emphasis : style.link__disabled} onClick={() => setValues({ ...values, selectedPvP:true })}>
                  <span className={style.icon}>📝 </span>
                  <Link href="/room/create">ルームを作る</Link>
                </div>
              </>
            : <>
                <div className={`${style.link__active} ${style.show}`}>
                  <span className={style.icon}>🤖 </span>
                  <button onClick={() => setValues({ ...values, selectedPvE: true })}>1人で遊ぶ</button>
                </div>
                <div
                  className={authUser ? `${style.link__active} ${style.show}` : style.link__disabled}
                  onClick={() => {
                    authUser ? setValues({ ...values, selectedPvP:true }) : undefined
                  }}>
                  <span className={style.icon}>👨‍👩‍👦‍👦 </span>
                  対人で遊ぶ
                </div>
                {isNotLoggedIn(authUser) && <span className={style.hint}>💡登録・ログインすると対人で遊ぶが行えます。</span>}
              </>
            }
            {!authUser &&
              <div className={style.loginBtn}>
                <div className={style.link__active}>
                  <span className={style.icon}>👤 </span>
                  <Link href="/user/login">登録・ログイン</Link>
                </div>
              </div>
            }
            {values.selectedPvP
            ? <div className={style.link__active} onClick={() => setValues(initialState)}>
                <span className={style.icon}>↩︎ </span>
                戻る
              </div>
            : <div className={style.link__active}>
                <span className={style.icon}>📖 </span>
                <Link href="/howto">ドボンのルール</Link>
              </div>
            }
          </div>
          {isLoggedIn(authUser) && <span onClick={() => logout()}>ログアウト</span>}
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