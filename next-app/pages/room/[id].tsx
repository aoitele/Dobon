import React, { useReducer, useContext } from 'react'
import RequireUserRegister from '../../components/feedback/requireUserRegister'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Emit, HandleEmitFn } from '../../@types/socket'
import Modal from '../../components/game/Modal'
import { reducer } from '../../utils/game/roomStateReducer'
import useWsConnectHooks from '../../hooks/useWsConnectHooks'
import useStateHooks from '../../hooks/useStateHooks'
import useEventHooks from '../../hooks/useEventHooks'
import axiosInstance from '../../utils/api/axiosInstance'
import { RoomAPIResponse } from '../../@types/api/roomAPI'
import hasProperty from '../../utils/function/hasProperty'
import { AuthStateContext } from '../../context/authProvider'
import Board from '../../components/game/board'
import sleep from '../../utils/game/sleep'
import { initialState } from '../../utils/game/state'
import ScoreBoard from '../../components/game/score'
import { isAuthUserFetching, isNotLoggedIn } from '../../utils/auth/authState'
import { throwServerSideError404 } from '../../server/throwServerSideError404'

interface Props {
  room: RoomAPIResponse['roomInfo']
}

const Room: React.FC<Props> = ({ room }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { authUser } = useContext(AuthStateContext)
  const router = useRouter()

  const handleEmit: HandleEmitFn = async (data: Emit) => {
    if (hasProperty(state, 'wsClient') && state.wsClient?._socket !== null ) {
      await state.wsClient?.emit(data)
      await sleep(500) // State更新処理を待たせるため0.5秒のsleepを噛ませる
    }
  }

  useWsConnectHooks(router, state, dispatch)
  useStateHooks(router, state, handleEmit, authUser, room, dispatch)
  useEventHooks(state, handleEmit, authUser, room, dispatch)

  // Before fetch authUser from context
  if (isAuthUserFetching(authUser)) return <Modal handleEmit={handleEmit} loading={true}/>
  
  // If not LoggedIn, request for register
  if (isNotLoggedIn(authUser)) return <RequireUserRegister />

  // After fetched authUser,rendering depend on game.status
  if (state.game.status === 'playing') {
    return <Board room={room} handleEmit={handleEmit} state={state} authUser={authUser}/>
  }

  if (state.game.status === 'ended' || state.game.status === 'showScore') {
    return <ScoreBoard room={room} handleEmit={handleEmit} state={state} authUser={authUser} />
  }
  const isCreatedUser = authUser.id === room.create_user_id
  if (state.game && isCreatedUser) {
    state.game.status = 'created'
  }
  
  return <Modal room={room} game={state.game} handleEmit={handleEmit} authUser={authUser}/>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const roomId = ctx.params?.id
  if (typeof roomId === 'undefined') {
    return throwServerSideError404(ctx)
  }

  const axios = axiosInstance()
  const url = `/api/room/${roomId}`
  try {
    const res = await axios.get(url)
    const { room } = res.data
    const title = room.title
    if (room) {
      return { props: { room, title } }
    }
  } catch (e) {
    return throwServerSideError404(ctx)
  }
  return throwServerSideError404(ctx)
}

export default Room
