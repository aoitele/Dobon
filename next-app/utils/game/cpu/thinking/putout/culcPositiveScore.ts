import deepcopy from "deepcopy"
import { OtherHands } from "../../../../../@types/game"
import { sepalateSuitNum } from "../../../checkHand"
import { dobonJudge, resReachNumbers } from "../../../dobonJudge"
import { DetectionInfo } from "./updatePrediction"

export interface CulcPositiveScoreParams {
  ownHands: OtherHands
  prediction: DetectionInfo
}

export const POSITIVESCORE_REVERSE_DOBON = 100
export const POSITIVESCORE_REVERSE_DOBON_NEXT_TURN = 50

const culcPositiveScore = ({ ownHands, prediction }: CulcPositiveScoreParams): DetectionInfo => {
  const result = deepcopy(prediction)
  ownHands.hands.forEach(card => {
    const cardNum = sepalateSuitNum([card])[0].num
    const checkHandCards = ownHands.hands.filter(item => item !== card)
    const canReverseDobon = dobonJudge(card, checkHandCards) // ドボン返し状態である
    
    // for Debug
    const r:{20:number[], 10:number[], score:number} = {
      20:[],
      10:[],
      score:0,
    }

    const { reachNums } = resReachNumbers(checkHandCards) // リーチ状態にできる
    
    // for Debug
    r[20].push(...reachNums)
    r.score += 20 * reachNums.length

    if (canReverseDobon) {
      result[Number(cardNum)].positiveScore += POSITIVESCORE_REVERSE_DOBON // ドボン返しをつくれるため安牌
    }
    if (reachNums.length) {
      addPositiveScore({ reachNums, result, addScore: 20, cardNum })
    }
    // 次のターンでドボン返しにできるか、またはリーチにできるかチェック
    let nextTurnCanReverseDobon = false
    for (const testCard of checkHandCards) {
      if (!nextTurnCanReverseDobon) {
        nextTurnCanReverseDobon = dobonJudge(testCard, checkHandCards)
      }
      const rest = checkHandCards.filter(item => item !== testCard)
      const testReachNums = resReachNumbers(rest).reachNums

      // for Debug
      r[10].push(...testReachNums)
      r.score += 10 * testReachNums.length
 
      if (testReachNums.length) {
        addPositiveScore({ reachNums: testReachNums, result, addScore: 10, cardNum })
      }
    }
    if (nextTurnCanReverseDobon) {
      result[Number(cardNum)].positiveScore += POSITIVESCORE_REVERSE_DOBON_NEXT_TURN // ドボン返しをつくれるため安牌
    }
  })
  return result
}

interface AddPositiveScoreParams {
  reachNums:number[]
  result: DetectionInfo
  addScore: number
  cardNum: string
}

const addPositiveScore = ({ reachNums, result, addScore, cardNum }: AddPositiveScoreParams) => {
  for (const num of reachNums) {
    if (result[num].remain) {
      result[Number(cardNum)].positiveScore += addScore
    }
  }
}

export { culcPositiveScore }