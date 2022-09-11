import { OtherHands } from "../../../../../@types/game"
import { cntCloseCard } from "../../../checkHand"
// Import { resReachNumbers } from "../../../dobonJudge"
import { UsefulInfo } from "./culcDobonRisk"

/**
 * AvailableNumber: UsefulInfo['CardInfo']のremainが0でない、ドボンマチ数値計算に利用できる数字の配列
 */
export interface UpdatePredictionArgs {
  otherHand: OtherHands['hands'] | string[]
  availableNumber: number[]
  usefulInfo: UsefulInfo
}

/**
 * 被ドボン確率計算機
 * 手札枚数で決まる計算ロジックを用いて、zの枚数分だけ全通りのマチ数字を計算
 * 1〜13に収まればpredictionにスコア加算してusefulInfoを返す関数
 */
const updatePrediction = ({ otherHand, availableNumber, usefulInfo }: UpdatePredictionArgs) => {
  // Const handLen = otherHand.length
  const cntClose = cntCloseCard(otherHand)
  // Const isAllCardClosed = handLen === cntClose
  if (cntClose === 0) return usefulInfo  // 手札が全て公開状態であれば検証しない

  // 手札1枚ずつ、availableNumberに存在する数字を用いてマチ数字を計算させる
  for (let i=0; i<otherHand.length; i+=1) {
    let testCard = otherHand[i] // 検証するカード
    
    for (let k=0; k<availableNumber.length; k+=1) {
      if (testCard === 'z') {
        // 検証カードが非公開手札の時、availableNumberの数字を利用してマチを計算、利用する数字はusefulInfo > remainから1枚分引き、remainが0になる数字はマチ計算の対象から外れる
        const testNum = availableNumber[k]
        testCard = testNum === 0 ? 'x0o' : `c${testNum}o`

      
        // Const arg = testNum === 0 ? 'x0o' : `c${testNum}o`

        /**
         * AvailableNumberの数字を利用してマチを計算
         * 利用する数字はusefulInfo > remainから1枚分引き、remainが0になる数字はマチ計算の対象から外れる
         */
      } else {
        // Let testNum = availableNumber[k]

        /*
         * 検証カードが公開手札の時 availableNumberごとにマチを計算
         * const arg = testNum === 0 ? 'x0o' : `c${testNum}o`
         * const rn = resReachNumbers([testCard, arg])
         */
      }
    }
  }

  return 0
}

export { updatePrediction }