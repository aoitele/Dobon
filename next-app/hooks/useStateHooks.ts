import { useEffect, Dispatch } from 'react'
import { NextRouter } from 'next/router'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState, Action } from '../utils/game/roomStateReducer'
import { AuthState } from '../context/authProvider'
import { RoomAPIResponse } from '../@types/api/roomAPI'
import hasProperty from '../utils/function/hasProperty'
import { updateMyHandsStatus, resetMyHandsStatus } from '../utils/game/checkHand'

const useStateHooks = (
  router:NextRouter,
  state: gameInitialState,
  handleEmit: HandleEmitFn,
  authUser:AuthState['authUser'],
  room: RoomAPIResponse.RoomInfo,
  dispatch:Dispatch<Action> ) => {
    // If you are joined room or room owner, join event hooks run
    useEffect(() => {
      if (!state.connected || !state.roomId || !authUser || typeof authUser === 'undefined') return
      if (authUser.id === room.create_user_id || hasProperty(authUser, 'participate_room_id') && authUser.participate_room_id.includes(room.id)) {
        handleEmit({ roomId:room.id, userId:authUser.id, nickname:authUser.nickname, event: 'join' })
      }
    },[authUser])
    
    // Getusers when WebSocket connection has established
    useEffect(() => {
      if (state.connected) {
        const data: Emit = {
          roomId: Number(router.query.id),
          event: 'getparticipants'
        }
        handleEmit(data)
      }
    },[state.connected])

    // Hooks with turn changed
    useEffect(() => {
      if (!state.game?.board.turn) return
      updateHandsFn(state, authUser, dispatch)
    },[state.game?.board.turn])
}

const updateHandsFn = (
  state:gameInitialState,
  authUser:AuthState['authUser'],
  dispatch:Dispatch<Action>) => {
  if (!hasProperty(state.game, 'board') || !authUser) return
  const { users, turn, hands, trash } = state.game.board
  if (!users || !turn || !hands) return

  const me = state.game?.board.users.filter(_ => _.id === authUser.id)[0]
  const isMyTurn = (me && me.turn === turn)
  isMyTurn
  ? updateMyHandsStatus({state, hands, trash, dispatch})
  : resetMyHandsStatus({state, hands, dispatch})
}

export default useStateHooks