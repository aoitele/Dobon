import { Player } from "../../@types/game"
const isMyTurnFn = (me:Player, turnUser:Player) => me.turn === turnUser.turn

const isNextUserTurnFn = (me:Player, turnUser:Player, users:Player[]) => {
  const userCnt = users.length
  const isLastUser = me.turn === userCnt
  return isLastUser
  ? turnUser.turn === 1
  : me.turn + 1 === turnUser.turn
}

export { isMyTurnFn, isNextUserTurnFn }