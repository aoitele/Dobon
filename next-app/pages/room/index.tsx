import React, { useContext } from 'react'
import Link from 'next/link'
import axiosInstance from '../../utils/api/axiosInstance'
import { Room } from 'prisma/prisma-client'
import RoomList from '../../components/data_display/RoomList'
import { AuthStateContext } from '../../context/authProvider'
import styles from './index.module.scss'
import { RoomAPIResponse } from '../../@types/api/roomAPI'

interface Props {
  rooms: RoomAPIResponse.RoomInfo[]
}

const Index: React.FC<Props> = ({ rooms }) => {
  const { authUser, fetched } = useContext(AuthStateContext)
  return (
  <>
    <div className={styles.bg}>
      <div>RoomList</div>
        {
          fetched &&
          <ul className={styles.ul}>
          { rooms && rooms.map((room, idx) => (
            <RoomList key={idx} room={room} authUser={authUser}/>
          ))}
          </ul>
        }
      <Link href="/room/create">Create Room</Link>
    </div>
  </>
  )
}

export const getServerSideProps = async () => {
  const axios = axiosInstance()
  try {
    const res = await axios.get('/api/room')
    const rooms: Room[] | undefined = res.data?.rooms
    const title = 'ルーム一覧'
    return {
      props: { rooms, title }
    }
  } catch (e) {
    console.log(e, 'error')
    return { props: {} }
  }
}
export default Index
