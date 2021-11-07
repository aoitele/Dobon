import { useEffect } from 'react'
import { NextRouter } from 'next/router'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState } from '../utils/game/roomStateReducer'
import { AuthState } from '../context/authProvider'
import { RoomAPIResponse } from '../@types/api/roomAPI'
import hasProperty from '../utils/function/hasProperty'

const useStateHooks = (
  router:NextRouter,
  state: gameInitialState,
  handleEmit: HandleEmitFn,
  authUser:AuthState['authUser'],
  room: RoomAPIResponse.RoomInfo) => {
    // If you are joined room, join event hooks run
    useEffect(() => {
      if (!state.connected || !state.roomId || !authUser) return
      if (!hasProperty(authUser, 'participate_room_id')) return
      if (authUser.participate_room_id.includes(room.id)) {
        handleEmit({ roomId:room.id, userId:authUser.id, nickname:authUser.nickname, event: 'join' })
      }
  },[authUser])

   // GetUsers when WebSocket connection has established  
   useEffect(() => {
    if (state.connected) {
      const data: Emit = {
        roomId: Number(router.query.id),
        event: 'getUsers'
      }
      handleEmit(data)
    }
  },[state.connected])
  
}

export default useStateHooks