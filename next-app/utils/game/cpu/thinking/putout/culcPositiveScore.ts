import deepcopy from "deepcopy"
import { OtherHands } from "../../../../../@types/game"
import { DOBON_CARD_NUMBER_JOKER } from "../../../../../constant"
import { isJoker } from "../../../checkCard"
import { sepalateSuitNum } from "../../../checkHand"
import { dobonJudge, resReachNumbers } from "../../../dobonJudge"
import { DetectionInfo } from "./updatePrediction"

export interface CulcPositiveScoreParams {
  ownHands: OtherHands
  prediction: DetectionInfo
}

export const POSITIVESCORE_REVERSE_DOBON = 10000
export const POSITIVESCORE_REVERSE_DOBON_NEXT_TURN = 50

const culcPositiveScore = ({ ownHands, prediction }: CulcPositiveScoreParams): DetectionInfo => {
  const result = deepcopy(prediction)

  // positiveScore計算済みのカード数字を格納。未検証の数字のみpositiveScoreを計算させる
  const verifiedNumbers:string[] = []

  ownHands.hands.forEach(card => {
    const cardNum = isJoker(card) ? String(DOBON_CARD_NUMBER_JOKER) : sepalateSuitNum([card])[0].num

    if (verifiedNumbers.includes(cardNum)) return

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
      result[Number(cardNum)].positiveScore = POSITIVESCORE_REVERSE_DOBON // ドボン返しをつくれるため安牌として確定させ、次のカードの検証へ
      return
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
    verifiedNumbers.push(cardNum)
  })

  // positiveScoreで比較となる数字は柄の優先度を決めておく（これはputOutPhaseで出すカードを判別する際に考慮させる）
  selectPositiveSuit({ ownHands, result })

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

interface SelectPositiveSuitParams {
  ownHands: OtherHands
  result: DetectionInfo
}

// 数字ごとにどの柄を出すのが有利かを判定するための関数。保有する柄が多いカードを出す候補として採用する。
const selectPositiveSuit = ({ ownHands, result }: SelectPositiveSuitParams) => {

  // 手札の柄数をカウント
  const suitCounts: {[key:string]: number} = { c:0, d:0, h:0, s:0 }
  const sepExcludeJoker = sepalateSuitNum(ownHands.hands).filter(card => card.suit !== 'x')
  sepExcludeJoker.forEach(info => {
    suitCounts[info.suit] += 1
  })

  // 手札の数字ごとに優先とする柄を選択。同じ数字のカードがある場合、柄の多い方を採用する。
  const uniqueNumSet = new Set(sepExcludeJoker.map(info => info.num))
  uniqueNumSet.forEach(num => {
    const sameNumSep = sepExcludeJoker.filter(item => item.num === num)
    const suitCandidates = sameNumSep.map(sep => sep.suit)
    if (suitCandidates.length === 1) {
      result[Number(num)].positiveSuit = suitCandidates[0]
      return
    }

    let mostOwnedSuit: DetectionInfo[0]['positiveSuit'] = null
    suitCandidates.forEach(suit => {
      if (mostOwnedSuit === null) {
        mostOwnedSuit = suit
      } else if (suitCounts[mostOwnedSuit] < suitCounts[suit]) {
        mostOwnedSuit = suit
      }
    })
    result[Number(num)].positiveSuit = mostOwnedSuit
  })
}

export { culcPositiveScore }