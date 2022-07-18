import React, { useContext, useEffect, useState, VFC } from 'react'
import styles from './index.module.scss'
import MenuTab from './modules/MenuTab'
import axiosInstance from '../../../../utils/api/axiosInstance'
import Loading from '../../../feedback/Loading'
import { AuthState, AuthStateContext } from '../../../../context/authProvider'
import { isAuthUserFetching, isLoggedIn, isNotLoggedIn } from '../../../../utils/auth/authState'
import Link from 'next/link'
import RoomList from '../../../data_display/RoomList'
import { RoomAPIResponse } from '../../../../@types/api/roomAPI'

export interface RoomIndexState {
  data: RoomAPIResponse['rooms'][]
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
    if (isAuthUserFetching(authUser) || isNotLoggedIn(authUser)) return

    const fetch = async() => {
      const type = values.isActiveOnline ? 'online' : 'friend'
      const data = await fetchData({ type, authUser })
      if (data) {
        setValues({...values, loading:false, data})
      } else {
        setValues({...values, loading:false})
      }
    }
    fetch()
  }, [values.loading, authUser])

  return (
    <div className={styles.wrap}>
      <MenuTab values={values} setValues={setValues}/>
      {values.loading || isAuthUserFetching(authUser)
        ? <Loading/>
        : values.isActiveFriend && <FriendMode authUser={authUser} data={values.data}/>
      }
      {/* オンライン対戦選択時 */}
      {values.isActiveOnline && <OnlineMode/>}
    </div>
  )
}

interface FriendModeProps {
  authUser: AuthState['authUser']
  data: RoomAPIResponse['rooms'][]
}

const FriendMode:VFC<FriendModeProps> = ({ authUser, data }) => {
  return isLoggedIn(authUser)
  ? <>
      <div>
        <p>あなたの開催ゲーム</p>
        <ul className={styles.listWrap}>
          {data.map(room => <RoomList key={room.id} authUser={authUser} room={room}/>)}
        </ul>
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
  type: 'online' | 'friend',
  authUser: NonNullable<AuthState['authUser']>
}

const fetchData = async({ type, authUser }: FecthDataProps) => {
  const headers = {
    Authorization: `Bearer ${authUser.access_token}`
  }
  const axios = axiosInstance({ headers })

  try {
    const res = await axios.get<RoomAPIResponse['rooms'][]>('/api/room', { params: { type, userId: authUser.id } })
    return res.data
  } catch(e) {
    return []
  }
}

export default RoomIndex