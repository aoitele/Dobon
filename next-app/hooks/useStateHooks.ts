import { useEffect, Dispatch } from 'react'
import { NextRouter } from 'next/router'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState, Action } from '../utils/game/roomStateReducer'
import { AuthState } from '../context/authProvider'
import { RoomAPIResponse } from '../@types/api/roomAPI'
import hasProperty from '../utils/function/hasProperty'
import { cardsICanPutOut } from '../utils/game/checkHand'
import { useUpdateStateFn } from '../utils/game/state'

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
  useEffect(() => {
    if (!state.game?.board) return
    const { users, turn, hands, trash } = state.game.board
    if (!users || !turn || !hands || !authUser) return
    // 自ターンになった場合に実行する処理
    const me = users.filter(_ => _.id === authUser.id)[0]
    if (me && me.turn === turn) {
      // 場に出せる手札を判定、isPutable=trueにする(['${suit}${num}p', ...])
      const putableCards = cardsICanPutOut(hands,trash)
      const newHands = hands.map(_ => putableCards.includes(_) ? `${_}p`: `${_}`)
      const data = {
        game: {
          board: {
            hands: newHands
          }
        }
      }
      const newState = useUpdateStateFn(state, data)
      dispatch({ type: 'updateStateSpecify', payload: newState })
    }
  },[state.game?.board.turn])
}

export default useStateHooks