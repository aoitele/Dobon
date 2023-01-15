import { Dispatch } from 'react'
import { updateMyHandsStatus } from "./checkHand"
import { AuthState } from '../../context/AuthProvider'
import hasProperty from '../function/hasProperty'
import { gameInitialState,Action } from "./roomStateReducer"
import { Emit, HandleEmitFn } from '../../@types/socket'
import { RoomAPIResponse } from '../../@types/api/roomAPI'

interface Props {
  roomId: RoomAPIResponse['roomInfo']['id'],
  game: gameInitialState['game'],
  authUser: AuthState['authUser'],
  handleEmit: HandleEmitFn
}

const getHandFn = async({roomId, game, authUser, handleEmit}:Props):Promise<void> => {
  const data: Emit = {
    roomId,
    gameId: game?.id,
    userId: authUser?.id,
    event: 'gethand'
  }
  await handleEmit(data)
  console.log('gethand end')
}

const updateHandsFn = (
  state:gameInitialState,
  authUser:AuthState['authUser'],
  dispatch:Dispatch<Action>) => {
  if (!hasProperty(state.game, 'board') || !authUser) return
  const { users, turn, hands, trash } = state.game.board
  if (!users || !turn || !hands) return
  const me = state.game?.board.users.filter(_ => _.id === authUser.id)[0]
  console.log(me.turn === turn, 'me.turn === turn')
  if (me && me.turn === turn) {
    updateMyHandsStatus({state, hands, trash, dispatch})
  }
}

export { getHandFn, updateHandsFn }