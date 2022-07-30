import React, { Dispatch, SetStateAction, useContext, useEffect, useState, VFC } from 'react'
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
  myRooms: RoomAPIResponse['rooms'][]
  friendRooms: RoomAPIResponse['rooms'][]
  isActiveOnline: boolean
  isActiveFriend: boolean
  loading: boolean
  searching: boolean
  invitationCode: string
  message: string
}

const initialState:RoomIndexState = {
  myRooms: [],
  friendRooms: [],
  isActiveOnline: false,
  isActiveFriend: true,
  loading: true,
  searching: false,
  invitationCode: '',
  message: ''
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
        setValues({...values, loading:false, myRooms: data})
      } else {
        setValues({...values, loading:false})
      }
    }
    fetch()
  }, [values.loading, authUser])

  return (
    <div className={styles.wrap}>
      <MenuTab values={values} setValues={setValues}/>
      <div className={styles.inner}>
        {values.loading || isAuthUserFetching(authUser)
          ? <Loading/>
          : values.isActiveFriend &&
          <FriendMode
            authUser={authUser}
            myRooms={values.myRooms}
            friendRooms={values.friendRooms}
            values={values}
            setValues={setValues}
          />
        }
        {/* オンライン対戦選択時 */}
        {values.isActiveOnline && <OnlineMode/>}
      </div>
    </div>
  )
}

interface FriendModeProps {
  authUser: AuthState['authUser']
  myRooms: RoomAPIResponse['rooms'][]
  friendRooms: RoomAPIResponse['rooms'][]
  values: RoomIndexState
  setValues: Dispatch<SetStateAction<RoomIndexState>>
}

const FriendMode:VFC<FriendModeProps> = ({ authUser, myRooms, friendRooms, values, setValues }) => {
  const updateValue = (invitationCode: string) => {
    setValues(state => ({ ...state, invitationCode }))
  }

  /**
   * フレンドの開催ゲーム検索
   * 招待コードが合致したゲーム情報を取得し表示させる
   */
  const submit = async() => {
    if (values.searching) return
    if (!isLoggedIn(authUser)) return
    setValues((prevState) => ({ ...prevState, message:'', searching: true }))

    let message = ''
    const data = await fetchData({
      type: 'friend',
      authUser,
      option: {
        invitationCode: values.invitationCode
      }
    })
    if (data.length && data[0]) {
      const roomId = data[0].id
      const myRoomIds = values.myRooms.map(room => room.id)
      const friendRoomIds = values.friendRooms.map(room => room.id)
      if (!myRoomIds.includes(roomId) && !friendRoomIds.includes(roomId)) {
        setValues((prevState) => ({...prevState, friendRooms: [...values.friendRooms, data[0]], searching: false, invitationCode: '', message}))
        return
      }
    } else {
      message = 'ゲームが見つかりませんでした。'
    }
    setValues((prevState) => ({ ...prevState, searching: false, invitationCode: '', message }))
  }

  return isLoggedIn(authUser)
  ? <>
      <section className={styles.section}>
        <p className={styles.heading}>あなたの開催ゲーム</p>
        <ul className={styles.listWrap}>
          {myRooms.map(room => <RoomList key={room.id} authUser={authUser} room={room}/>)}
        </ul>
      </section>
      <section className={styles.section}>
        <p className={styles.heading}>フレンドの開催ゲーム</p>
        <ul className={styles.listWrap}>
          {friendRooms.map(room => <RoomList key={room.id} authUser={authUser} room={room}/>)}
        </ul>
        <div className={styles.invitationCodeTextArea}>
          <textarea
            rows={1}
            placeholder='招待コードを入力✏️'
            value={values.invitationCode}
            onChange={(e) => updateValue(e.currentTarget.value)}
          />
        </div>
        <p>{values.message}</p>
        <p className={styles.searchSubmit} onClick={submit}>{values.searching ? '検索中...' : 'ゲームを検索'}</p>
      </section>
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
  option?: {
    invitationCode: string
  }
}

const fetchData = async({ type, authUser, option }: FecthDataProps) => {
  const headers = {
    Authorization: `Bearer ${authUser.access_token}`
  }
  const axios = axiosInstance({ headers })
  const params:any = { type, userId: authUser.id }
  if (option) {
    for (const [key, value] of Object.entries(option)) {
      params[key] = value
    }
  }

  try {
    const res = await axios.get<RoomAPIResponse['rooms'][]>('/api/room', { params })
    return res.data
  } catch(e) {
    return []
  }
}

export default RoomIndex