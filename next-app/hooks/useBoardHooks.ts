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
  const lastTrashUserIsMe = state.game.board.trash.user.id === me?.id
  const effect = state.game.board.effect

  const resActionBtnStyle = (isMyTurn:boolean) => {
    if (!isMyTurn) return 'disabled'
    if (values.isDrawnCard) return 'skip'
    return values.isBtnActive.action ? 'active' : 'draw'
  }

  /**
   * どぼんボタンがアクティブになるパターン
   * - ゲーム開始時
   * - 他ユーザーがカードを出した次のターン(そのターン限り)
   * - 自分がまだドローしていない時
   */
  const resDobonBtnStyle = () => {
    const isGameStartPhase = state.game.board.trash.user.turn === 0 // ゲーム開始時
    const allowDobon = state.game.board.allowDobon

    if (isGameStartPhase && allowDobon) return 'dobon'
    if (!lastTrashUserIsMe && allowDobon) return 'dobon'

    return 'disabled'
  }

  useEffect(() => {
    if (!users || !turnUser || !me) return
    const isMyTurn = isMyTurnFn(me, turnUser)
    const isReversed = (typeof effect !== 'undefined') && effect.includes('reverse')

    const isNextUserTurn = isNextUserTurnFn(me, turnUser, users, isReversed)
    const actionBtnStyle = resActionBtnStyle(isMyTurn)
    const dobonBtnStyle = resDobonBtnStyle(isNextUserTurn, lastTrashUserIsMe)

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