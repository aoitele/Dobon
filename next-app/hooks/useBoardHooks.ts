/**
 * Components/boardで利用するHooks
 * boardのState更新などを行う
 */

import { useEffect } from 'react'
import { InitialBoardState, Player } from '../@types/game'
import { gameInitialState } from '../utils/game/roomStateReducer'
import { isMyTurnFn, isNextUserTurnFn } from '../utils/game/turnInfo'

interface Props {
  state: gameInitialState
  values: InitialBoardState
  setValues: React.Dispatch<React.SetStateAction<InitialBoardState>>
  initialState: InitialBoardState
  me?: Player
}

const useBoardHooks = ({ state, values, setValues, initialState, me } : Props) => {
  const users = state.game?.board.users
  const turnUser = state.game?.board && users ? users.filter(_ => _.turn === state.game?.board.turn)[0] : null

  useEffect(() => {
    if (!users || !turnUser || !me) return
    const isMyTurn = isMyTurnFn(me, turnUser)
    const isNextUserTurn = isNextUserTurnFn(me, turnUser, users)
    const actionBtnStyle = isMyTurn ? values.isBtnActive.action ? 'active' : 'action' : 'disabled'
    const dobonBtnStyle = isNextUserTurn ? 'disabled' : values.isBtnActive.dobon ? 'active': 'dobon'

    // ターン変更orアクションボタン作動時 → 自ターンとアクションボタンのステートを変更
    setValues({
      ...initialState,
      isMyTurn,
      isNextUserTurn,
      actionBtnStyle,
      dobonBtnStyle,
    })
  },[turnUser])

}
export default useBoardHooks