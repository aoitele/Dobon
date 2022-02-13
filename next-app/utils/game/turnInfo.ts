import { Player, Effect } from "../../@types/game"
import { NestedPartial } from "../../@types/utility"

const isMyTurnFn = (me:Player, turnUser:Player) => me.turn === turnUser.turn

const isNextUserTurnFn = (me:Player, turnUser:Player, users:Player[]) => {
  const userCnt = users.length
  const isLastUser = me.turn === userCnt
  return isLastUser
  ? turnUser.turn === 1
  : me.turn + 1 === turnUser.turn
}

/**
 * 次のターンを計算する処理
 * ターンのリバース状態(isReversed)によって結果が異なる
 */
const culcNextUserTurn = (turn: number, users:NestedPartial<Player>[], effect: Effect | '', isReversed: boolean): number => {
  const len = users.length
  const nextTurn = turn

  switch (effect) {
    case 'skip':
      return isReversed
      ? culcFromMinus(nextTurn, len, -2)     
      : culcFromPlus(nextTurn, len, 2) 
    case 'reverse':
      return isReversed
      ? culcFromPlus(nextTurn, len, 1)
      : culcFromMinus(nextTurn, len, -1)     
    default:
      return isReversed
      ? culcFromMinus(nextTurn, len, -1)
      : culcFromPlus(nextTurn, len, 1)
  }
}

const culcFromPlus = (nextTurn: number, len: number, plus:number) => {
  const _nextTurn = nextTurn + plus
  return (_nextTurn <= len) ? _nextTurn : _nextTurn - len
}

const culcFromMinus = (nextTurn: number, len: number, minus:number) => {
  const _nextTurn = nextTurn + minus
  const orLess0 = _nextTurn <= 0
  return orLess0 ? len + _nextTurn : _nextTurn
}

/**
 * 前のターンを計算する処理
 * isReversed true(+1),false(-1)
 */
const culcBeforeUserTurn = (turn: number, users:NestedPartial<Player>[], isReversed: boolean): number => {
  const len = users.length
  const culcNum = isReversed ? 1 : -1
  const test = turn + culcNum
  const result = test === 0 ? len : test > len ? 1 : test
  return result
}
export { isMyTurnFn, isNextUserTurnFn, culcNextUserTurn, culcBeforeUserTurn }