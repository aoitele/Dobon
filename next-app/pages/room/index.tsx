import React from 'react'
import Link from 'next/link'
import axiosInstance from '../../utils/api/axiosInstance'
import { Room } from 'prisma/prisma-client'

interface Props {
    rooms: Room[]
}

const RoomList: React.FC<Props> = ({ rooms }) => (
    <>
        <div>RoomList</div>
        { rooms.map((room, idx) => 
            <div key={idx}>
                <Link href={`/room/${room.id}`}>
                    <p>{room.title}</p>
                </Link>
            </div>
        ) }
        <Link href='/room/create'>Create Room</Link>
    </>
    )

export const getServerSideProps = async ()=> {
    const axios = axiosInstance();
    try {
        const res = await axios.get('/api/room');
        const rooms: Room[] = res.data?.rooms;
        return {
            props: { rooms }
        }
    }
    catch(e) {
        console.log(e, 'error')
        return { props: {} }
    }
}
export default RoomList