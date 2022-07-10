import React, { useContext, useEffect, useState, VFC } from 'react'
import styles from './index.module.scss'
import MenuTab from './modules/MenuTab'
import axiosInstance from '../../../../utils/api/axiosInstance'
import { Room } from '../../../../@types/game'
import Loading from '../../../feedback/Loading'
import { AuthState, AuthStateContext } from '../../../../context/authProvider'
import { isAuthUserFetching, isLoggedIn } from '../../../../utils/auth/authState'
import Link from 'next/link'

export interface RoomIndexState {
  data: Room[]
  isActiveOnline: boolean,
  isActiveFriend: boolean,
  loading: boolean
}

const initialState:RoomIndexState = {
  data: [],
  isActiveOnline: false,
  isActiveFriend: true,
  loading: true,
}

/**
 * 「対人で遊ぶ」用、ルーム一覧
 * ログインしていない場合はログイン誘導を行う
 */
const RoomIndex:VFC = () => {
  const [values, setValues] = useState(initialState)
  const { authUser } = useContext(AuthStateContext)

  useEffect(() => {
    if (!values.loading) return

    const fetch = async() => {
      const query = values.isActiveOnline ? 'online' : 'friend'
      const data = await fetchData({ query, authUser })
      if (data) {
        setValues({...values, loading:false, data})
      } else {
        setValues({...values, loading:false})
      }
    }
    fetch()
  }, [values.loading])

  return (
    <div className={styles.wrap}>
      <MenuTab values={values} setValues={setValues}/>
      {values.loading || isAuthUserFetching(authUser)
        ? <Loading/>
        : values.isActiveFriend && <FriendMode authUser={authUser}/>
      }
      {/* オンライン対戦選択時 */}
      {values.isActiveOnline && <OnlineMode/>}
    </div>
  )
}

const FriendMode = (props: { authUser: AuthState['authUser']}) => {
  return isLoggedIn(props.authUser)
  ? <>
      <div>
        <p>あなたの開催ゲーム</p>
      </div>
      <div>
        <p>フレンドの開催ゲーム</p>
      </div>
    </>
  : <div>
    <p>フレンド対戦を利用するにはログインが必要です。</p>
    <Link href="/user/login">
      <a>ログインする</a>
    </Link>
  </div>
}

const OnlineMode = () => {
  return (
    <div>online Mode Comming Soon...</div>
  )
}

interface FecthDataProps {
  query: 'online' | 'friend',
  authUser: AuthState['authUser']
}

const fetchData = async({ query, authUser }: FecthDataProps) => {
  if (!isLoggedIn(authUser)) return []

  const headers = {
    Authorization: `Bearer ${authUser.access_token}`
  }
  const axios = axiosInstance({ headers })

  try {
    const res = await axios.get<Room[]>('/api/room', { params: { data: query } })
    return res.data
  } catch(e) {
    return []
  }
}

export default RoomIndex