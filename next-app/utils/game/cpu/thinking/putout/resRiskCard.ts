import { OtherHands } from "../../../../../@types/game"
import { resReachNumbers } from "../../../dobonJudge"
import spreadCardState from "../../../spreadCardState"

/**
 * 全カードを公開しているユーザーがいる場合にリスク数字を算出する関数
 * 対象ユーザーがいない場合は空配列を返す
 */
const resRiskCard = (otherHands: OtherHands[]): number[] => {
  const defineRiskCards:number[] = []  // 全て公開カードなどで待ち数字と分かっている数字
  const spreadCard = otherHands.map(item => spreadCardState(item.hands))

  // 全公開ユーザーがいれば確定リスクカードに追加
  for (let i=0; i<spreadCard.length; i+=1) {
    const openCardCnt = spreadCard[i].filter(item => item.isOpen).length // 公開中のカード枚数
    const handsLen = spreadCard[i].length // 検査対象ユーザーの手札数
    if (openCardCnt !== handsLen) continue // eslint-disable-line no-continue

    // 手札枚数により待ち数字を計算する
    const otherHandsInfo = resReachNumbers(otherHands[i].hands)
    if (otherHandsInfo.reachNums.length) {
      defineRiskCards.push(...otherHandsInfo.reachNums)
    }
  }
  // 数字を一意にして返す
  const defineRiskCardsUnique = [...new Set(defineRiskCards)]

  return defineRiskCardsUnique
}

export { resRiskCard }