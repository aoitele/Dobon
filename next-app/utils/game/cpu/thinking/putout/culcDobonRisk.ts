import { HandCards } from "../../../../../@types/card"
import { OtherHands } from "../../../../../@types/game"
import { canIReverseDobon } from "../../../reverseDobon"
import spreadCardState from "../../../spreadCardState"
import { dobonProbability } from "./dobonProbability"
import { DobonRiskReturnValue, DOBONRISK_MIN, DOBONRISK_MAX } from "./main"
import { DeckCards } from "./resRemainingCard"

/**
 * 被ドボンリスクの計算処理
 * ownHandsの全カードをチェックした結果を返す
 */
 interface CulcRiskProps {
  ownHands: HandCards[]
  otherHands:OtherHands[]
  defineRiskCards: number[]
  remainingCard: DeckCards
}

const culcDobonRisk = ({ownHands, defineRiskCards}: CulcRiskProps): DobonRiskReturnValue => {
  const res:DobonRiskReturnValue = []

  // リスク計算処理
  const check = (card: HandCards) => {
    const putOutNum: number = spreadCardState([card])[0].num

    // ドボン返しを作れる場合、最良リスクで返却する
    if (canIReverseDobon(card, ownHands)) {
      return { card, dobonRisk: DOBONRISK_MIN }
    }
    // 確定リスクカードに含まれる数字の場合、最大リスクを結果として返す
    if (defineRiskCards.includes(putOutNum))
    return { card, dobonRisk: DOBONRISK_MAX }

    // どちらでもない場合、ドボンリスク算出に入る
    return { card, dobonRisk: dobonProbability() }
  }

  // 全手札のリスクを算出した結果をレスポンスデータに入れて返す
  for (let i=0; i<ownHands.length; i+=1) {
    const risk = check(ownHands[i])
    if (risk) res.push(risk)
  }
  return res
}

export { culcDobonRisk }