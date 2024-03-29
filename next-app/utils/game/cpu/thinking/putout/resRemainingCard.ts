import { Card } from "../../../../../@types/card"
import { OtherHands } from "../../../../../@types/game"
import spreadCardState from "../../../spreadCardState"
import { DetectionInfo } from "./updatePrediction"

export type DeckCards = {
  [key in NonNullable<Card['num']>]: number // eslint-disable-line no-unused-vars
}

interface Params {
  ownHands: OtherHands,  // 他ユーザーの手札状態
  otherHands: OtherHands[],  // 他ユーザーの手札状態
  trashedMemory: string[] // 現時点で出されているカードの記憶
}

/**
 * 過去に出されたカードと他ユーザーの公開手札、自分の手札から
 * 各数字の残り枚数を計算する関数
 */
const resRemainingCard = ({ ownHands, otherHands, trashedMemory }: Params) => {
  const detectionInfo: DetectionInfo = {
    0: { remain: 2, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null }, // Joker
    1: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    2: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    3: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    4: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    5: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    6: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    7: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    8: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    9: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    10: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    11: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    12: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
    13: { remain: 4, prediction: 0, damageRisk:0, positiveScore: 0, positiveSuit: null },
  }

  const ownHandCards = ownHands.hands.map(item => `${item}o`)
  const otherHandCards = otherHands.map(item => item.hands).flat()
  const addOpenTrashedMemory = trashedMemory.map(trash => `${trash}o`)
  let seed = [...addOpenTrashedMemory, ...otherHandCards, ...ownHandCards]

  // Joker'x1o'は先に処理しておく
  if (seed.includes('x1o')) {
    seed = seed.filter(item => item !== 'x1o')
    detectionInfo[0].remain -= 1
  }

  const trashNums = spreadCardState(seed).filter(item => item.isOpen).map<keyof DeckCards>(card => card.num)
  for (let i=0; i < trashNums.length; i+=1) {
    const key:keyof DeckCards = trashNums[i]
    detectionInfo[key].remain -= 1
  }

  return detectionInfo
}

export { resRemainingCard }