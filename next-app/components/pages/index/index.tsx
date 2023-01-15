import React, { FC, useContext, useState } from 'react'
import Image from 'next/image'
import style from './index.module.scss'
import Link from 'next/link'
import { AuthStateContext } from '../../../context/AuthProvider'
import { isAuthUserFetching, isLoggedIn } from '../../../utils/auth/authState'
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
      {values.selectedPvE && <PVESelecterModal setValues={setValues}/>}
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
          {isLoggedIn(authUser) && <p>Welcome! <span className={style.nickanme}>{authUser.nickname}</span></p>}
          <div>
            {values.selectedPvP
            ? <>
                <div className={style.link__active_emphasis}>
                  <span className={style.icon}>🃏 </span>
                  <Link href="/room">ゲームに参加</Link>
                </div>
                <div className={authUser ? style.link__active_emphasis : style.link__disabled} onClick={() => setValues({ ...values, selectedPvP:true })}>
                  <span className={style.icon}>📝 </span>
                  <Link href="/room/create">ゲームを作成</Link>
                </div>
              </>
            : <>
                <div className={`${style.link__active} ${style.show}`}>
                  <span className={style.icon}>🤖 </span>
                  <button onClick={() => setValues({ ...values, selectedPvE: true })}>1人で遊ぶ</button>
                </div>
                <div className={authUser ? `${style.link__active} ${style.show}` : style.link__disabled} onClick={() => setValues({ ...values, selectedPvP:true })}>
                  <span className={style.icon}>👨‍👩‍👦‍👦 </span>
                  対人で遊ぶ
                </div>
              </>
            }
            {!authUser &&
              <div className={style.loginBtn}>
                <div className={style.link__active}>
                  <span className={style.icon}>👤 </span>
                  <Link href="/user/login">登録/ログイン</Link>
                </div>
                {/* <span className={style.hint}>You can play with friends if LoggedIn!</span> */}
              </div>
            }
            {values.selectedPvP
            ? <div className={style.link__active} onClick={() => setValues(initialState)}>
                <span className={style.icon}>↩︎ </span>
                戻る
              </div>
            : <div className={style.link__active}>
                <span className={style.icon}>📖 </span>
                <Link href="/howto">ゲームルール</Link>
              </div>
            }
          </div>
          {isLoggedIn(authUser) && <span onClick={() => logout()}>ログアウトする</span>}
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