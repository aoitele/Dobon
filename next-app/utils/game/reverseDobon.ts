import { HandCards } from "../../@types/card"
import { resReachNumbers } from "./dobonJudge"
import spreadCardState from "./spreadCardState"

/**
 * 手札を出す際に「ドボン返しを作れるか」を判定する関数
 */
const canIReverseDobon = (putOutCard: HandCards, ownHands: HandCards[]) => {
  const putOutNum: number = spreadCardState([putOutCard])[0].num
  const excludedHands = ownHands.filter(item => item !== putOutCard)

  if (excludedHands.length) {
    const { reachNums }= resReachNumbers(excludedHands)
    if (reachNums.includes(putOutNum)) {
      return true // ドボン返し構成になっているためリスクゼロ
    }
  }
  return false
}

export { canIReverseDobon }