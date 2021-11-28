import React, { useReducer, useContext } from 'react'
import RequireUserRegister from '../../components/feedback/requireUserRegister'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Emit, HandleEmitFn } from '../../@types/socket'
import Modal from '../../components/game/Modal'
import { reducer, gameInitialState } from '../../utils/game/roomStateReducer'
import useWsConnectHooks from '../../hooks/useWsConnectHooks'
import useStateHooks from '../../hooks/useStateHooks'
import useEventHooks from '../../hooks/useEventHooks'
import axiosInstance from '../../utils/api/axiosInstance'
import { RoomAPIResponse } from '../../@types/api/roomAPI'
import hasProperty from '../../utils/function/hasProperty'
import { AuthStateContext } from '../../context/authProvider'
import Board from '../../components/game/board'

interface Props {
  room: RoomAPIResponse.RoomInfo
}

const initialState: gameInitialState = {
  roomId: null,
  userId: null,
  game: {
    id: null,
    status: 'join',
    event: null,
    board: {
      users: [],
      deck: [],
      hands: [],
      trash: [],
      otherHands: [],
      turn: null,
      effect: {
        type: null,
        value: null
      }
    }
  },
  connected: false,
  wsClient: null
}

const Room: React.FC<Props> = ({ room }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { authUser, fetched } = useContext(AuthStateContext)
  const router = useRouter()

  const handleEmit: HandleEmitFn = (data: Emit) => {
    if (hasProperty(state, 'wsClient') && state.wsClient?.socket !== null) {
      state.wsClient?.socket.emit('emit', data)
    }
  }

  useWsConnectHooks(router, state, dispatch)
  useStateHooks(router, state, handleEmit, authUser, room, dispatch)
  useEventHooks(state, handleEmit, authUser)

  // Before fetch authUser from context
  if (!authUser) {
    return fetched
    ? <RequireUserRegister />
    : <Modal handleEmit={handleEmit} loading={true}/>
  }
  
  // After fetched authUser,rendering depend on game.status
  if (state.game?.status === 'playing') {
    return <Board room={room} handleEmit={handleEmit} state={state} authUser={authUser}/>
  }

  const isCreatedUser = authUser.id === room.create_user_id
  if (state.game && isCreatedUser) {
    state.game.status = 'created'
  }
  
  return <Modal room={room} game={state.game} handleEmit={handleEmit} authUser={authUser}/>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.params) {
    const axios = axiosInstance()
    const url = `/api/room/${ctx.params.id}`
    try {
      const res = await axios.get(url)
      const { room } = res.data
      return room ? {props: {room}} : {props: {}}
    } catch (e) {
      throw new Error('room api request failed')
    }
  }
  return { props: {} }
}

export default Room
